#!/usr/bin/env node
// Prints, as a JSON array, the packages the release workflow must publish to JSR,
// in publish order.
//
//   node scripts/release-plan.mjs --paths <json>   the paths release-please released,
//                                                  e.g. ["packages/clover"]
//   node scripts/release-plan.mjs --all            every package (manual recovery run)
//
// Each entry is { "package": "<dir under packages/>", "name": "<jsr name>",
// "version": "<jsr.json version>" }. A package whose version is already on JSR is
// left out (the "already on JSR?" guard), so a rerun never republishes.
// payments-core goes first, because the providers import it; the rest keep
// alphabetical order.
//
// It fails when a package's jsr.json and package.json versions differ, when a path
// is not a package, or when JSR answers with anything but 200 or 404: publishing
// on a guess is worse than a failed run that can be retried. Diagnostics go to
// stderr; stdout carries only the JSON.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

/** The releases still to publish, in publish order. */
export async function releasePlan(root, packages, fetchFn = fetch) {
  const plan = [];
  for (const pkg of publishOrder([...new Set(packages)])) {
    const release = readRelease(root, pkg);
    if (await isOnJsr(release.name, release.version, fetchFn)) {
      console.error(`${release.name}@${release.version} is already on JSR: skipping.`);
      continue;
    }
    console.error(`${release.name}@${release.version} will be published.`);
    plan.push(release);
  }
  return plan;
}

async function main(argv) {
  const root = process.cwd();
  const pathsIndex = argv.indexOf('--paths');
  let packages;
  if (argv.includes('--all')) packages = discoverPackages(root);
  else if (pathsIndex !== -1) packages = packagesFromPaths(argv[pathsIndex + 1]);
  else throw new Error('Pass --paths <json> or --all');
  return releasePlan(root, packages);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2)).then(
    (plan) => process.stdout.write(`${JSON.stringify(plan)}\n`),
    (error) => {
      console.error(error.message);
      process.exitCode = 1;
    }
  );
}
