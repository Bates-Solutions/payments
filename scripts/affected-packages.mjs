#!/usr/bin/env node
// Prints, as a JSON array, the packages CI must check for a change set.
//
//   node scripts/affected-packages.mjs --base <sha>   packages affected by <base>...HEAD
//   node scripts/affected-packages.mjs --all          every package
//
// Rules, per changed path:
//   packages/<p>/...                      affects <p> (when packages/<p>/package.json exists)
//   a root *.md file or LICENSE*          affects nothing
//   anything else (root config, lockfile, .github/, scripts/, a path under
//   packages/ that is not a package)      affects every package
//
// The package list is discovered from packages/*/package.json. Without a usable
// base (none given, all zeros, or not in the local history) every package is
// affected. Diagnostics go to stderr; stdout carries only the JSON.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Names of the directories under `<root>/packages` that hold a package.json, sorted. */
export function discoverPackages(root) {
  const dir = join(root, 'packages');
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, 'package.json')))
    .map((entry) => entry.name)
    .sort();
}

/** True for root files that cannot change any package's checks. */
function isRootDoc(path) {
  if (path.includes('/')) return false;
  return /\.md$/i.test(path) || /^LICENSE/i.test(path);
}

/** The packages affected by `changedFiles`, sorted. */
export function affectedPackages(changedFiles, packages) {
  const known = new Set(packages);
  const affected = new Set();
  for (const raw of changedFiles) {
    const path = raw.trim();
    if (path === '' || isRootDoc(path)) continue;
    const match = /^packages\/([^/]+)\/./.exec(path);
    if (match && known.has(match[1])) {
      affected.add(match[1]);
      continue;
    }
    return [...packages].sort();
  }
  return [...affected].sort();
}

function changedFilesSince(base, cwd) {
  if (!base || /^0+$/.test(base)) return null;
  try {
    const out = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return out.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`git diff against ${base} failed: ${error.message.trim()}`);
    return null;
  }
}

function main(argv) {
  const root = process.cwd();
  const packages = discoverPackages(root);
  const baseIndex = argv.indexOf('--base');
  const base = baseIndex === -1 ? '' : (argv[baseIndex + 1] ?? '');
  const files = argv.includes('--all') ? null : changedFilesSince(base, root);
  if (files === null) {
    console.error('No usable base: checking every package.');
    return packages;
  }
  console.error(`Changed files (${files.length}):\n${files.map((f) => `  ${f}`).join('\n')}`);
  return affectedPackages(files, packages);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.stdout.write(`${JSON.stringify(main(process.argv.slice(2)))}\n`);
}
