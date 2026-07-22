# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

`@bates-solutions/stripe` — TypeScript wrapper around the Stripe API with webhook helpers. Single-package library published to **JSR** (`jsr:@bates-solutions/stripe`); JSR publishes the TypeScript source directly, so there is no build/bundle step for distribution. Sibling to `@bates-solutions/squareup` (which remains on npm) and intentionally mirrors its shape so consumers of one know all.

**Structure:**

- `src/core/` — main client, services (one per Stripe domain), errors, utils, types
- `src/core/services/` — service classes wrapping the Stripe SDK resource clients
- `src/core/__tests__/` — vitest tests mirroring service files
- `src/server/` — webhook signature verification + handlers
- `docs/guides/` — usage guides; `docs/api/` — generated API docs

## Commands

```bash
npm run build        # tsc → dist/
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src
npm run lint:fix     # eslint src --fix
npm test             # vitest run
npm run test:watch   # vitest (watch mode)
npm run test:coverage
npm run docs         # typedoc
```

Always run `typecheck`, `lint`, and `test` before committing.

## Conventions

- Package manager: `npm`
- One service class per Stripe domain in `src/core/services/<name>.service.ts`
- All SDK calls wrapped in `try/catch` → `parseStripeError(error)`
- Mutating endpoints accept `idempotencyKey?` in options, default to `createIdempotencyKey()` (passed to Stripe as a request option)
- Input validation throws `StripeValidationError`
- Money amounts: integer minor units (`number`), e.g. cents
- Tests use `vitest` with `vi.fn()` mocks of the Stripe SDK client — no real network calls
- New services must be wired into `src/core/client.ts` and exported from `src/core/index.ts`

## Git Commits & PRs

- **ALWAYS create a PR for code changes** — never push directly to `main`, even for small fixes
- Do NOT include "Generated with Claude Code" or similar self-references in commit messages or PR descriptions
- Do NOT add `Co-Authored-By` lines mentioning Claude or Anthropic
- Keep commit messages and PR descriptions focused on the changes, not how they were made
- Publishing goes to JSR via OIDC (`.github/workflows/publish-jsr.yml`), triggered by pushing a `v*` tag. To release: bump the `version` in `jsr.json` (keep `package.json` in sync), merge, then tag `vX.Y.Z` and push the tag. Use conventional commit prefixes (`feat:`, `fix:`, `chore:`, etc.)

## Documentation

This is a public library (published on JSR) — consumers rely on docs to discover and use new functionality.

- **Every PR that adds or changes public API surface must update docs in the same PR**:
  - `README.md` — feature list and service table
  - `docs/guides/core/<service>.md` — usage guide for each service (create one for new services)
  - JSDoc on public methods/types — TypeDoc regenerates `docs/api/` from these
- Bug fixes that don't change public behavior don't require doc updates
