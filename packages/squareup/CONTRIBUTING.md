# Contributing

Thanks for your interest in improving `@bates-solutions/squareup`. This is a
public TypeScript wrapper around the Square API; the notes below keep changes
consistent and releasable.

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

- **Package manager:** `npm`.
- **One service per Square domain** in `src/core/services/<name>.service.ts`.
- All Square SDK calls are wrapped in `try/catch` and rethrown through
  `parseSquareError(error)`.
- Mutating endpoints accept an optional `idempotencyKey` and default to
  `createIdempotencyKey()`, except money-moving calls (`payments.create`,
  `refunds.refundPayment`, `cards.create`, `subscriptions.create`), which
  require one: a random default would charge twice on a retry.
- Input validation throws `SquareValidationError`.
- Money amounts are `bigint` cents, coerced with `BigInt(value)`.
- Tests live in `src/core/__tests__/`, mirror the service files, and mock the
  Square SDK with `vi.fn()` — no real network calls.
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
