// Run with `npm run test:scripts` (node --test).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  isOnJsr,
  packagesFromPaths,
  publishOrder,
  readRelease,
  releasePlan,
} from './release-plan.mjs';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'release-plan.mjs');

const tempDirs = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

/** A repo with packages/<name>/{jsr,package}.json for each `{ name: version }`. */
function tempRepo(versions, npmVersions = {}) {
  const root = mkdtempSync(join(tmpdir(), 'release-plan-'));
  tempDirs.push(root);
  for (const [name, version] of Object.entries(versions)) {
    const dir = join(root, 'packages', name);
    mkdirSync(dir, { recursive: true });
    const jsrName = `@bates-solutions/${name}`;
    writeFileSync(join(dir, 'jsr.json'), JSON.stringify({ name: jsrName, version }));
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name: jsrName, version: npmVersions[name] ?? version })
    );
  }
  return root;
}

/** A fetch stub answering from `{ '<jsr name>': [versions] | <status> }`. */
function jsrStub(registry) {
  const calls = [];
  const fetchFn = async (url) => {
    calls.push(url);
    const name = /^https:\/\/jsr\.io\/(.+)\/meta\.json$/.exec(url)[1];
    const entry = registry[name];
    if (entry === undefined) return { status: 404, json: async () => ({}) };
    if (typeof entry === 'number') return { status: entry, json: async () => ({}) };
    const versions = Object.fromEntries(entry.map((v) => [v, {}]));
    return { status: 200, json: async () => ({ versions }) };
  };
  return { fetchFn, calls };
}

describe('publishOrder', () => {
  it('puts payments-core first and sorts the rest', () => {
    assert.deepEqual(publishOrder(['stripe', 'payments-core', 'clover']), [
      'payments-core',
      'clover',
      'stripe',
    ]);
  });

  it('leaves out payments-core when it was not released', () => {
    assert.deepEqual(publishOrder(['squareup', 'clover']), ['clover', 'squareup']);
  });
});

describe('packagesFromPaths', () => {
  it('maps release-please paths to package names', () => {
    assert.deepEqual(packagesFromPaths('["packages/clover","packages/stripe/"]'), [
      'clover',
      'stripe',
    ]);
  });

  it('treats empty output as nothing released', () => {
    assert.deepEqual(packagesFromPaths(''), []);
    assert.deepEqual(packagesFromPaths('[]'), []);
    assert.deepEqual(packagesFromPaths(undefined), []);
  });

  it('rejects a path that is not a package', () => {
    assert.throws(() => packagesFromPaths('["."]'), /not a package/);
    assert.throws(() => packagesFromPaths('["packages/clover/src"]'), /not a package/);
  });

  it('rejects output that is not an array', () => {
    assert.throws(() => packagesFromPaths('{"packages/clover":true}'), /JSON array/);
  });
});

describe('readRelease', () => {
  it('reads the jsr name and version', () => {
    const root = tempRepo({ clover: '1.1.1' });
    assert.deepEqual(readRelease(root, 'clover'), {
      package: 'clover',
      name: '@bates-solutions/clover',
      version: '1.1.1',
    });
  });

  it('fails when jsr.json and package.json disagree', () => {
    const root = tempRepo({ clover: '1.1.1' }, { clover: '1.1.0' });
    assert.throws(
      () => readRelease(root, 'clover'),
      /jsr\.json is 1\.1\.1 but package\.json is 1\.1\.0/
    );
  });

  it('fails for a package without jsr.json', () => {
    const root = tempRepo({});
    assert.throws(() => readRelease(root, 'clover'), /has no jsr\.json/);
  });
});

describe('isOnJsr', () => {
  it('is true for a published version', async () => {
    const { fetchFn } = jsrStub({ '@bates-solutions/clover': ['1.1.0'] });
    assert.equal(await isOnJsr('@bates-solutions/clover', '1.1.0', fetchFn), true);
  });

  it('is false for a new version or a new package', async () => {
    const { fetchFn } = jsrStub({ '@bates-solutions/clover': ['1.1.0'] });
    assert.equal(await isOnJsr('@bates-solutions/clover', '1.1.1', fetchFn), false);
    assert.equal(await isOnJsr('@bates-solutions/payments-core', '0.1.0', fetchFn), false);
  });

  it('fails on any other status rather than guessing', async () => {
    const { fetchFn } = jsrStub({ '@bates-solutions/clover': 503 });
    await assert.rejects(isOnJsr('@bates-solutions/clover', '1.1.1', fetchFn), /answered 503/);
  });
});

describe('releasePlan', () => {
  it('lists unpublished releases in publish order and skips published ones', async () => {
    const root = tempRepo({ clover: '1.1.1', stripe: '1.0.3', 'payments-core': '0.1.0' });
    const { fetchFn } = jsrStub({
      '@bates-solutions/clover': ['1.1.0'],
      '@bates-solutions/stripe': ['1.0.3'],
    });
    const plan = await releasePlan(root, ['stripe', 'clover', 'payments-core'], fetchFn);
    assert.deepEqual(
      plan.map((r) => `${r.package}@${r.version}`),
      ['payments-core@0.1.0', 'clover@1.1.1']
    );
  });

  it('checks each package once', async () => {
    const root = tempRepo({ clover: '1.1.1' });
    const { fetchFn, calls } = jsrStub({});
    await releasePlan(root, ['clover', 'clover'], fetchFn);
    assert.equal(calls.length, 1);
  });
});

describe('CLI', () => {
  it('prints [] for an empty release without touching the network', () => {
    const root = tempRepo({ clover: '1.1.0' });
    const out = execFileSync('node', [SCRIPT, '--paths', '[]'], { cwd: root, encoding: 'utf8' });
    assert.equal(out, '[]\n');
  });

  it('exits non-zero without --paths or --all', () => {
    const root = tempRepo({});
    assert.throws(
      () => execFileSync('node', [SCRIPT], { cwd: root, stdio: 'pipe' }),
      (error) => error.status === 1 && /--paths <json> or --all/.test(String(error.stderr))
    );
  });
});
