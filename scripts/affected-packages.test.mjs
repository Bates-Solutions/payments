// Run with `npm run test:scripts` (node --test).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { affectedPackages, discoverPackages } from './affected-packages.mjs';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'affected-packages.mjs');
const PACKAGES = ['clover', 'squareup', 'stripe'];

const tempDirs = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function tempRepo(packages) {
  const root = mkdtempSync(join(tmpdir(), 'affected-'));
  tempDirs.push(root);
  for (const name of packages) {
    mkdirSync(join(root, 'packages', name, 'src'), { recursive: true });
    writeFileSync(join(root, 'packages', name, 'package.json'), '{}\n');
  }
  return root;
}

describe('affectedPackages', () => {
  it('maps a change under one package to that package', () => {
    assert.deepEqual(
      affectedPackages(
        ['packages/clover/src/core/client.ts', 'packages/clover/README.md'],
        PACKAGES
      ),
      ['clover']
    );
  });

  it('collects several packages, sorted', () => {
    assert.deepEqual(
      affectedPackages(['packages/stripe/src/a.ts', 'packages/clover/jsr.json'], PACKAGES),
      ['clover', 'stripe']
    );
  });

  for (const path of [
    'tsconfig.base.json',
    'package.json',
    'package-lock.json',
    'eslint.config.js',
    'vitest.shared.ts',
    'vitest.config.ts',
    '.prettierrc',
    '.gitignore',
    '.github/workflows/ci.yml',
    'scripts/affected-packages.mjs',
    'packages/README.md',
    'packages/not-a-package/file.ts',
    'docs/guide.md',
  ]) {
    it(`treats ${path} as affecting every package`, () => {
      assert.deepEqual(affectedPackages(['packages/clover/src/a.ts', path], PACKAGES), PACKAGES);
    });
  }

  for (const path of ['README.md', 'CHANGELOG.md', 'LICENSE', 'license.txt']) {
    it(`treats the root doc ${path} as affecting nothing`, () => {
      assert.deepEqual(affectedPackages([path], PACKAGES), []);
    });
  }

  it('returns nothing for an empty change set', () => {
    assert.deepEqual(affectedPackages([], PACKAGES), []);
  });
});

describe('discoverPackages', () => {
  it('finds every directory under packages/ with a package.json', () => {
    const root = tempRepo(['stripe', 'clover', 'payments-core']);
    mkdirSync(join(root, 'packages', 'empty-dir'));
    writeFileSync(join(root, 'packages', 'README.md'), '# packages\n');
    assert.deepEqual(discoverPackages(root), ['clover', 'payments-core', 'stripe']);
  });

  it('returns nothing without a packages/ directory', () => {
    assert.deepEqual(discoverPackages(tempRepo([])), []);
  });

  it('lets a newly added package be affected on its own', () => {
    const packages = discoverPackages(tempRepo([...PACKAGES, 'payments-core']));
    assert.deepEqual(affectedPackages(['packages/payments-core/src/index.ts'], packages), [
      'payments-core',
    ]);
    assert.deepEqual(affectedPackages(['tsconfig.base.json'], packages), [
      'clover',
      'payments-core',
      'squareup',
      'stripe',
    ]);
  });
});

describe('CLI', () => {
  const git = (cwd, ...args) =>
    execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const run = (cwd, ...args) =>
    JSON.parse(
      execFileSync(process.execPath, [SCRIPT, ...args], {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    );

  function committedRepo() {
    const root = tempRepo(PACKAGES);
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'ci@example.com');
    git(root, 'config', 'user.name', 'CI');
    git(root, 'config', 'commit.gpgsign', 'false');
    writeFileSync(join(root, 'README.md'), '# repo\n');
    writeFileSync(join(root, 'tsconfig.base.json'), '{}\n');
    writeFileSync(join(root, 'packages', 'clover', 'src', 'shared.ts'), 'export const a = 1;\n');
    git(root, 'add', '.');
    git(root, 'commit', '-q', '-m', 'base');
    return { root, base: git(root, 'rev-parse', 'HEAD') };
  }

  function commit(root, path) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), `${Math.random()}\n`);
    git(root, 'add', path);
    git(root, 'commit', '-q', '-m', `change ${path}`);
  }

  it('diffs <base>...HEAD', () => {
    const { root, base } = committedRepo();
    commit(root, 'packages/clover/README.md');
    assert.deepEqual(run(root, '--base', base), ['clover']);
    commit(root, 'README.md');
    assert.deepEqual(run(root, '--base', base), ['clover']);
    commit(root, 'tsconfig.base.json');
    assert.deepEqual(run(root, '--base', base), PACKAGES);
  });

  it('prints [] for a root-docs-only change', () => {
    const { root, base } = committedRepo();
    commit(root, 'README.md');
    assert.deepEqual(run(root, '--base', base), []);
  });

  it('counts a move between packages as both packages', () => {
    const { root, base } = committedRepo();
    mkdirSync(join(root, 'packages', 'stripe', 'src'), { recursive: true });
    git(root, 'mv', 'packages/clover/src/shared.ts', 'packages/stripe/src/moved.ts');
    git(root, 'commit', '-q', '-m', 'move');
    assert.deepEqual(run(root, '--base', base), ['clover', 'stripe']);
  });

  it('counts a root file moved into a package as affecting every package', () => {
    const { root, base } = committedRepo();
    git(root, 'mv', 'tsconfig.base.json', 'packages/clover/tsconfig.base.json');
    git(root, 'commit', '-q', '-m', 'move');
    assert.deepEqual(run(root, '--base', base), PACKAGES);
  });

  it('checks the remaining packages when a package is deleted', () => {
    const { root, base } = committedRepo();
    git(root, 'rm', '-q', '-r', 'packages/stripe');
    git(root, 'commit', '-q', '-m', 'delete stripe');
    assert.deepEqual(run(root, '--base', base), ['clover', 'squareup']);
  });

  it('maps a non-ASCII path to its package', () => {
    const { root, base } = committedRepo();
    commit(root, 'packages/clover/src/caf\u00e9 r\u00e9sum\u00e9.ts');
    assert.deepEqual(run(root, '--base', base), ['clover']);
  });

  it('falls back to every package without a usable base', () => {
    const { root } = committedRepo();
    assert.deepEqual(run(root), PACKAGES);
    assert.deepEqual(run(root, '--base', '0000000000000000000000000000000000000000'), PACKAGES);
    assert.deepEqual(run(root, '--base', 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'), PACKAGES);
    assert.deepEqual(run(root, '--all'), PACKAGES);
  });
});
