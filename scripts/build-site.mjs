#!/usr/bin/env node
// Builds the combined GitHub Pages site that .github/workflows/docs.yml deploys.
//
//   node scripts/build-site.mjs              into site/
//   node scripts/build-site.mjs --out <dir>  into <dir>
//
// Output:
//   <out>/index.html   a landing page listing every package
//   <out>/<p>/         that package's typedoc API reference, as HTML
//
// A package is a directory under packages/ with a package.json, a jsr.json and a
// typedoc.json, so a new package (payments-core) needs no edit here. typedoc runs
// inside each package with that package's typedoc.json and `--html <out>/<p>`.
// Because each typedoc.json lists its markdown output under `outputs` (not `out`),
// the --html flag replaces it: building the site never rewrites the committed
// markdown in packages/<p>/docs/api (that is `npm run docs`).
//
// The output directory is emptied first. It must not be the repo root or one of
// its parents.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { discoverPackages } from './affected-packages.mjs';

export const REPO_URL = 'https://github.com/Bates-Solutions/payments';

/**
 * The packages that have API docs, sorted by directory: each is
 * { dir, name, version, description }, with name and version from jsr.json (the
 * registry) and the description from package.json.
 */
export function discoverDocPackages(root) {
  return discoverPackages(root)
    .filter((dir) =>
      ['jsr.json', 'typedoc.json'].every((file) => existsSync(join(root, 'packages', dir, file)))
    )
    .map((dir) => {
      const read = (file) => JSON.parse(readFileSync(join(root, 'packages', dir, file), 'utf8'));
      const jsr = read('jsr.json');
      const pkg = read('package.json');
      return {
        dir,
        name: String(jsr.name ?? pkg.name ?? dir),
        version: String(jsr.version ?? pkg.version ?? ''),
        description: String(pkg.description ?? ''),
      };
    });
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

/** The landing page: one entry per package, linking its API reference, JSR page and source. */
export function renderIndex(packages) {
  const items = packages
    .map((p) => {
      const dir = encodeURIComponent(p.dir);
      const version = p.version ? ` <span class="version">v${escapeHtml(p.version)}</span>` : '';
      const description = p.description ? `\n        <p>${escapeHtml(p.description)}</p>` : '';
      return `      <li>
        <h2><a href="./${dir}/">${escapeHtml(p.name)}</a>${version}</h2>${description}
        <p class="links">
          <a href="./${dir}/">API reference</a>
          <a href="https://jsr.io/${escapeHtml(p.name)}">JSR</a>
          <a href="${REPO_URL}/tree/main/packages/${dir}/docs/guides">Guides</a>
          <a href="${REPO_URL}/tree/main/packages/${dir}">Source</a>
        </p>
      </li>`;
    })
    .join('\n');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bates Solutions payments SDKs</title>
    <style>
      :root { color-scheme: light dark; --fg: #1f2328; --muted: #59636e; --link: #0969da; --bg: #ffffff; --line: #d1d9e0; }
      @media (prefers-color-scheme: dark) {
        :root { --fg: #f0f6fc; --muted: #9198a1; --link: #4493f8; --bg: #0d1117; --line: #3d444d; }
      }
      body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
      main { max-width: 46rem; margin: 0 auto; padding: 2rem 1rem; }
      a { color: var(--link); }
      ul { list-style: none; padding: 0; }
      li { border-top: 1px solid var(--line); padding: 1rem 0; }
      h2 { margin: 0; font-size: 1.25rem; }
      .version, .muted { color: var(--muted); font-weight: normal; font-size: 0.9rem; }
      .links a { margin-right: 1rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Bates Solutions payments SDKs</h1>
      <p class="muted">TypeScript wrappers for payment provider APIs, published on
        <a href="https://jsr.io/@bates-solutions">JSR</a>. Source:
        <a href="${REPO_URL}">Bates-Solutions/payments</a>.</p>
      <ul>
${items}
      </ul>
    </main>
  </body>
</html>
`;
}

/** Throws unless `out` is safe to empty: not the repo root or one of its parents. */
export function assertSafeOutDir(root, out) {
  const r = resolve(root);
  const o = resolve(out);
  if (o === r || r.startsWith(o.endsWith(sep) ? o : o + sep)) {
    throw new Error(`Refusing to empty ${o}: it is the repo root or one of its parents.`);
  }
}

function typedocRunner(root) {
  const require = createRequire(join(resolve(root), 'package.json'));
  const bin = join(dirname(require.resolve('typedoc/package.json')), 'bin', 'typedoc');
  return (pkgDir, htmlOut) => {
    execFileSync(process.execPath, [bin, '--html', htmlOut], { cwd: pkgDir, stdio: 'inherit' });
  };
}

/**
 * Empties `out`, writes each package's HTML API reference to `<out>/<dir>/` and the
 * landing page to `<out>/index.html`. `runTypedoc(pkgDir, htmlOut)` is injectable
 * for tests. Returns the packages built.
 */
export function buildSite(root, out, { runTypedoc = typedocRunner(root) } = {}) {
  assertSafeOutDir(root, out);
  const packages = discoverDocPackages(root);
  if (packages.length === 0) throw new Error('No packages with a jsr.json and typedoc.json.');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const p of packages) {
    console.error(`typedoc: ${p.name} -> ${join(out, p.dir)}`);
    runTypedoc(join(resolve(root), 'packages', p.dir), join(resolve(out), p.dir));
  }
  writeFileSync(join(out, 'index.html'), renderIndex(packages));
  return packages;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { values } = parseArgs({ options: { out: { type: 'string', default: 'site' } } });
  const root = process.cwd();
  const built = buildSite(root, resolve(root, values.out));
  console.error(`Built ${built.length} packages into ${values.out}/.`);
}
