// Run with `npm run test:scripts` (node --test).
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  assertSafeOutDir,
  buildSite,
  discoverDocPackages,
  REPO_URL,
  renderIndex,
} from './build-site.mjs';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const tempDirs = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function tempRepo(packages) {
  const root = mkdtempSync(join(tmpdir(), 'build-site-'));
  tempDirs.push(root);
  for (const [dir, files] of Object.entries(packages)) {
    mkdirSync(join(root, 'packages', dir), { recursive: true });
    for (const [file, content] of Object.entries(files)) {
      writeFileSync(join(root, 'packages', dir, file), JSON.stringify(content));
    }
  }
  return root;
}

const full = (name, version, description) => ({
  'package.json': { name: `@bates-solutions/${name}`, version, description },
  'jsr.json': { name: `@bates-solutions/${name}`, version },
  'typedoc.json': {},
});

describe('discoverDocPackages', () => {
  it('lists packages with package.json, jsr.json and typedoc.json, sorted by directory', () => {
    const root = tempRepo({
      stripe: full('stripe', '1.0.3', 'Stripe'),
      clover: full('clover', '1.1.0', 'Clover'),
      'no-typedoc': { 'package.json': {}, 'jsr.json': {} },
      'no-jsr': { 'package.json': {}, 'typedoc.json': {} },
    });
    assert.deepEqual(discoverDocPackages(root), [
      { dir: 'clover', name: '@bates-solutions/clover', version: '1.1.0', description: 'Clover' },
      { dir: 'stripe', name: '@bates-solutions/stripe', version: '1.0.3', description: 'Stripe' },
    ]);
  });

  it('takes name and version from jsr.json, the registry', () => {
    const root = tempRepo({
      core: {
        'package.json': { name: 'npm-name', version: '9.9.9' },
        'jsr.json': { name: '@bates-solutions/payments-core', version: '0.1.0' },
        'typedoc.json': {},
      },
    });
    const [p] = discoverDocPackages(root);
    assert.equal(p.name, '@bates-solutions/payments-core');
    assert.equal(p.version, '0.1.0');
    assert.equal(p.description, '');
  });

  it('returns nothing without a packages directory', () => {
    const root = mkdtempSync(join(tmpdir(), 'build-site-'));
    tempDirs.push(root);
    assert.deepEqual(discoverDocPackages(root), []);
  });
});

describe('renderIndex', () => {
  const pkgs = [
    { dir: 'clover', name: '@bates-solutions/clover', version: '1.1.0', description: 'Clover' },
    { dir: 'stripe', name: '@bates-solutions/stripe', version: '1.0.3', description: 'Stripe' },
  ];

  it('links each package to its API reference, JSR page, guides and source', () => {
    const html = renderIndex(pkgs);
    for (const p of pkgs) {
      assert.ok(html.includes(`<a href="./${p.dir}/">${p.name}</a>`));
      assert.ok(html.includes(`href="https://jsr.io/${p.name}"`));
      assert.ok(html.includes(`href="${REPO_URL}/tree/main/packages/${p.dir}/docs/guides"`));
      assert.ok(html.includes(`href="${REPO_URL}/tree/main/packages/${p.dir}"`));
      assert.ok(html.includes(`v${p.version}`));
    }
    assert.ok(html.indexOf('clover') < html.indexOf('stripe'));
  });

  it('escapes HTML in package metadata', () => {
    const html = renderIndex([
      { dir: 'x', name: '@a/<b>', version: '1"2', description: 'Tom & <script>' },
    ]);
    assert.ok(html.includes('Tom &amp; &lt;script&gt;'));
    assert.ok(html.includes('@a/&lt;b&gt;'));
    assert.ok(html.includes('v1&quot;2'));
    assert.ok(!html.includes('<script>'));
  });

  it('leaves out an empty version and description', () => {
    const html = renderIndex([{ dir: 'x', name: 'x', version: '', description: '' }]);
    assert.ok(!html.includes('class="version"'));
    assert.ok(!html.includes('<p></p>'));
  });
});

describe('assertSafeOutDir', () => {
  it('refuses the repo root and its parents', () => {
    assert.throws(() => assertSafeOutDir('/repo', '/repo'), /Refusing/);
    assert.throws(() => assertSafeOutDir('/repo', '/repo/'), /Refusing/);
    assert.throws(() => assertSafeOutDir('/a/repo', '/a'), /Refusing/);
    assert.throws(() => assertSafeOutDir('/repo', '/'), /Refusing/);
  });

  it('allows a directory inside the repo or elsewhere', () => {
    assert.doesNotThrow(() => assertSafeOutDir('/repo', '/repo/site'));
    assert.doesNotThrow(() => assertSafeOutDir('/repo', '/tmp/site'));
    assert.doesNotThrow(() => assertSafeOutDir('/repo', '/repository'));
  });
});

describe('buildSite', () => {
  it('runs typedoc per package into <out>/<dir> and writes the index', () => {
    const root = tempRepo({
      stripe: full('stripe', '1.0.3', 'Stripe'),
      clover: full('clover', '1.1.0', 'Clover'),
    });
    const out = join(root, 'site');
    mkdirSync(out);
    writeFileSync(join(out, 'stale.html'), 'old');
    const calls = [];
    const built = buildSite(root, out, {
      runTypedoc: (pkgDir, htmlOut) => {
        calls.push([pkgDir, htmlOut]);
        mkdirSync(htmlOut, { recursive: true });
        writeFileSync(join(htmlOut, 'index.html'), 'api');
      },
    });
    assert.deepEqual(
      built.map((p) => p.dir),
      ['clover', 'stripe']
    );
    assert.deepEqual(calls, [
      [join(root, 'packages', 'clover'), join(out, 'clover')],
      [join(root, 'packages', 'stripe'), join(out, 'stripe')],
    ]);
    assert.ok(existsSync(join(out, 'clover', 'index.html')));
    assert.ok(!existsSync(join(out, 'stale.html')), 'the output directory is emptied first');
    assert.ok(readFileSync(join(out, 'index.html'), 'utf8').includes('@bates-solutions/stripe'));
  });

  it('fails when no package has docs, without touching the output directory', () => {
    const root = tempRepo({ x: { 'package.json': {} } });
    const out = join(root, 'site');
    mkdirSync(out);
    writeFileSync(join(out, 'keep.html'), 'keep');
    assert.throws(() => buildSite(root, out, { runTypedoc: () => {} }), /No packages/);
    assert.ok(existsSync(join(out, 'keep.html')));
  });

  it('refuses to empty the repo root', () => {
    const root = tempRepo({ stripe: full('stripe', '1.0.3', 'Stripe') });
    assert.throws(() => buildSite(root, root, { runTypedoc: () => {} }), /Refusing/);
    assert.ok(existsSync(join(root, 'packages', 'stripe', 'package.json')));
  });
});

// The site build relies on these: with `out` set, typedoc writes it on every run, so
// --html would add markdown output beside the HTML instead of replacing it; and
// without explicit source links the output depends on the checkout (a worktree
// drops them).
describe('the packages in this repo', () => {
  const packages = discoverDocPackages(REPO_ROOT);

  it('include every provider', () => {
    const dirs = packages.map((p) => p.dir);
    for (const dir of ['clover', 'squareup', 'stripe']) assert.ok(dirs.includes(dir), dir);
  });

  for (const { dir } of packages) {
    it(`${dir}: typedoc.json lists only markdown outputs and sets explicit source links`, () => {
      const config = JSON.parse(
        readFileSync(join(REPO_ROOT, 'packages', dir, 'typedoc.json'), 'utf8')
      );
      assert.equal(config.out, undefined, 'use outputs, not out');
      assert.equal(config.html, undefined, 'no html output in the committed config');
      assert.deepEqual(config.outputs, [{ name: 'markdown', path: 'docs/api' }]);
      assert.equal(config.disableGit, true);
      assert.equal(config.gitRevision, 'main');
      assert.equal(
        config.sourceLinkTemplate,
        `${REPO_URL}/blob/{gitRevision}/packages/${dir}/src/{path}#L{line}`
      );
    });
  }
});
