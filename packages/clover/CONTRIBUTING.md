# Contributing

Thanks for your interest in improving `@bates-solutions/clover`. This is a
public TypeScript wrapper around the Clover Ecommerce and Platform APIs; the
notes below keep changes consistent and releasable.

## Getting started

```bash
npm ci             # at the repo root: installs every workspace from the one lockfile
npm run build      # in this package: compile to dist/
npm run dev        # in this package: compile in watch mode
```

## Before you open a pull request

Run these in the package while you work:

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint src
npm test           # vitest run
```

`npm run lint:fix` auto-fixes most style issues, and `npm run test:coverage`
reports coverage. Before you push, run `npm run check` at the repo root. It runs
lint, typecheck, build and tests for every package plus the script tests. CI
also checks coverage, the TypeDoc build and a JSR publish dry run.

## Conventions

- **Package manager:** `npm`. No vendor SDK: the client uses global `fetch` and
  WebCrypto. The one runtime dependency is `@bates-solutions/payments-core`.
- **One service per Clover domain** in `src/core/services/<name>.service.ts`.
- All `http` calls are wrapped in `try/catch` and rethrown through
  `parseCloverError(error)`.
- Mutating endpoints accept an optional `idempotencyKey` and default to
  `createIdempotencyKey()` (sent as the `idempotency-key` header).
- Input validation throws `CloverValidationError`.
- Money amounts are integer cents (`number`); currency is lowercase ISO.
- Tests live in `src/core/__tests__/`, mirror the service files, and mock
  `fetch` with `vi.fn()` — no real network calls.
- New services must be wired into `src/core/client.ts` and exported from
  `src/core/index.ts`.

## Documentation

This is a public library — consumers rely on the docs. **Any PR that adds or
changes public API surface must update docs in the same PR:**

- `README.md` — feature list and service table
- `docs/guides/core/<service>.md` — usage guide (create one for new services)
- JSDoc on public methods and types — TypeDoc regenerates `docs/api/` via
  `npm run docs`

## Commits and releases

- **Open a pull request for all changes** — nothing is pushed directly to `main`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) prefixes
  (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, …).
- Releasing: release-please opens a release PR from the commits under this
  package's folder. Merging it tags the version and publishes it to JSR. Never
  bump versions, create tags or run `jsr publish` by hand. See the root README.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](./LICENSE).
