# Contributing

Thanks for your interest in improving `@bates-solutions/squareup`. This is a
public TypeScript wrapper around the Square API; the notes below keep changes
consistent and releasable.

## Getting started

```bash
npm install        # install dependencies
npm run build      # compile to dist/
npm run dev        # compile in watch mode
```

## Before you open a pull request

Always run the full check suite locally — CI runs the same:

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint src
npm test           # vitest run
```

`npm run lint:fix` auto-fixes most style issues, and `npm run test:coverage`
reports coverage.

## Conventions

- **Package manager:** `npm`.
- **One service per Square domain** in `src/core/services/<name>.service.ts`.
- All Square SDK calls are wrapped in `try/catch` and rethrown through
  `parseSquareError(error)`.
- Mutating endpoints accept an optional `idempotencyKey` and default to
  `createIdempotencyKey()`.
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
- Releasing: bump the `version` in `jsr.json` (keep `package.json` in sync), then
  push a matching `vX.Y.Z` tag — the JSR publish workflow (OIDC) does the rest.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](./LICENSE).
