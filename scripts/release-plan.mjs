#!/usr/bin/env node
// Prints, as a JSON array, the packages the release workflow must publish to JSR,
// in publish order.
//
//   node scripts/release-plan.mjs --paths <json>   the paths release-please released,
//                                                  e.g. ["packages/clover"]
//   node scripts/release-plan.mjs --all            every package (manual recovery run)
//   add --require-tags                             fail unless each listed package's
//                                                  <pkg>-v<version> tag is at HEAD
//
// Each entry is { "package": "<dir under packages/>", "name": "<jsr name>",
// "version": "<jsr.json version>" }. A package whose version is already on JSR is
// left out (the "already on JSR?" guard), so a rerun never republishes.
// payments-core goes first, because the providers import it; the rest keep
// alphabetical order.
//
// It fails when a package's jsr.json and package.json versions differ, when a path
// is not a package, when JSR answers with anything but 200 or 404, or (with
// --require-tags) when a package to publish has no tag at HEAD: JSR versions are
// immutable, so a version must be published from the commit release-please tagged
// it at, and publishing on a guess is worse than a failed run that can be retried.
// Diagnostics go to stderr; stdout carries only the JSON.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { discoverPackages } from './affected-packages.mjs';

/** Packages the others depend on, published before the rest. */
const PUBLISH_FIRST = ['payments-core'];

/** `packages` with the PUBLISH_FIRST entries first and the rest sorted. */
export function publishOrder(packages) {
  const first = PUBLISH_FIRST.filter((name) => packages.includes(name));
  const rest = packages.filter((name) => !PUBLISH_FIRST.includes(name)).sort();
  return [...first, ...rest];
}

/** Package directory names from release-please's paths_released output. */
export function packagesFromPaths(pathsJson) {
  const text = (pathsJson ?? '').trim();
  if (text === '') return [];
  const paths = JSON.parse(text);
  if (!Array.isArray(paths)) throw new Error(`Expected a JSON array of paths, got: ${text}`);
  return paths.map((path) => {
    const match = /^packages\/([^/]+)\/?$/.exec(String(path));
    if (!match) throw new Error(`Released path is not a package: ${path}`);
    return match[1];
  });
}

/** The jsr.json name and version of packages/<pkg>, checked against its package.json. */
export function readRelease(root, pkg) {
  const dir = join(root, 'packages', pkg);
  const jsrPath = join(dir, 'jsr.json');
  if (!existsSync(jsrPath)) throw new Error(`packages/${pkg} has no jsr.json`);
  const jsr = JSON.parse(readFileSync(jsrPath, 'utf8'));
  const npm = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  if (jsr.version !== npm.version) {
    throw new Error(
      `packages/${pkg}: jsr.json is ${jsr.version} but package.json is ${npm.version}`
    );
  }
  return { package: pkg, name: jsr.name, version: jsr.version };
}

/** True when name@version is on JSR. `fetchFn` is injectable for tests. */
export async function isOnJsr(name, version, fetchFn = fetch) {
  const url = `https://jsr.io/${name}/meta.json`;
  const response = await fetchFn(url);
  if (response.status === 404) return false;
  if (response.status !== 200) throw new Error(`${url} answered ${response.status}`);
  const meta = await response.json();
  return Object.hasOwn(meta.versions ?? {}, version);
}

/** The release tag release-please gives a package version. */
export function releaseTag(release) {
  return `${release.package}-v${release.version}`;
}

/** Runs git in `root` and returns its trimmed stdout, or null when git fails. */
function git(root, args) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

/** Throws unless `release`'s tag exists and points at HEAD. `gitFn` is injectable. */
export function assertTaggedAtHead(root, release, gitFn = git) {
  const tag = releaseTag(release);
  const head = gitFn(root, ['rev-parse', 'HEAD']);
  const tagged = gitFn(root, ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}^{commit}`]);
  if (!tagged) throw new Error(`${tag} does not exist: release-please has not released it`);
  if (tagged !== head) {
    throw new Error(
      `${tag} is at ${tagged}, not HEAD ${head}: run the release workflow from the tag ` +
        `(gh workflow run release.yml --ref ${tag})`
    );
  }
}

/**
 * The releases still to publish, in publish order. With `requireTags`, each one
 * must be tagged at HEAD.
 */
export async function releasePlan(
  root,
  packages,
  { fetchFn = fetch, requireTags = false, gitFn = git } = {}
) {
  const plan = [];
  for (const pkg of publishOrder([...new Set(packages)])) {
    const release = readRelease(root, pkg);
    if (await isOnJsr(release.name, release.version, fetchFn)) {
      console.error(`${release.name}@${release.version} is already on JSR: skipping.`);
      continue;
    }
    if (requireTags) assertTaggedAtHead(root, release, gitFn);
    console.error(`${release.name}@${release.version} will be published.`);
    plan.push(release);
  }
  return plan;
}

/**
 * Parses the command line. Strict, so a misspelt flag fails the run instead of
 * silently dropping a check such as --require-tags.
 */
export function parseCli(argv) {
  const { values } = parseArgs({
    args: argv,
    strict: true,
    allowPositionals: false,
    options: {
      paths: { type: 'string' },
      all: { type: 'boolean', default: false },
      'require-tags': { type: 'boolean', default: false },
    },
  });
  if (values.all === (values.paths !== undefined)) {
    throw new Error('Pass exactly one of --paths <json> or --all');
  }
  return { all: values.all, paths: values.paths, requireTags: values['require-tags'] };
}

/** The CLI, minus process I/O. `root` and `fetchFn` are injectable for tests. */
export async function run(argv, { root = process.cwd(), fetchFn = fetch } = {}) {
  const options = parseCli(argv);
  const packages = options.all ? discoverPackages(root) : packagesFromPaths(options.paths);
  return releasePlan(root, packages, { fetchFn, requireTags: options.requireTags });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  run(process.argv.slice(2)).then(
    (plan) => process.stdout.write(`${JSON.stringify(plan)}\n`),
    (error) => {
      console.error(error.message);
      process.exitCode = 1;
    }
  );
}
