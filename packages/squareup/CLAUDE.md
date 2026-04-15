# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

`@bates-solutions/squareup` — TypeScript wrapper around the Square API with webhook helpers for Node.js backends. Single-package npm library, published from `main`.

**Structure:**

- `src/core/` — main client, services (one per Square domain), errors, utils, types
- `src/core/services/` — service classes wrapping Square SDK resource clients
- `src/core/__tests__/` — vitest tests mirroring service files
- `src/server/` — webhook signature verification + handlers
- `docs/guides/` — usage guides; `docs/api-reference.md` — generated API docs

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
- One service class per Square domain in `src/core/services/<name>.service.ts`
- All SDK calls wrapped in `try/catch` → `parseSquareError(error)`
- Mutating endpoints accept `idempotencyKey?` in options, default to `createIdempotencyKey()`
- Input validation throws `SquareValidationError`
- Money amounts: `bigint` cents, coerced with `BigInt(value)`
- Tests use `vitest` with `vi.fn()` mocks of the Square SDK client — no real network calls
- New services must be wired into `src/core/client.ts` and exported from `src/core/index.ts`

## Git Commits & PRs

- **ALWAYS create a PR for code changes** — never push directly to `main`, even for small fixes
- Do NOT include "Generated with Claude Code" or similar self-references in commit messages or PR descriptions
- Do NOT add `Co-Authored-By` lines mentioning Claude or Anthropic
- Keep commit messages and PR descriptions focused on the changes, not how they were made
- Release is automated via semantic-release on merge to `main` — use conventional commit prefixes (`feat:`, `fix:`, `chore:`, etc.)

## Documentation

This is a public npm library — consumers rely on docs to discover and use new functionality.

- **Every PR that adds or changes public API surface must update docs in the same PR** (or a follow-up PR opened immediately after merge):
  - `README.md` — feature list and service table
  - `docs/guides/core/<service>.md` — usage guide for each service (create one for new services)
  - JSDoc on public methods/types — TypeDoc regenerates `docs/api-reference.md` from these
- Bug fixes that don't change public behavior don't require doc updates
- If a PR is merged without docs, open a docs-only follow-up PR before moving on to other work

## Plan Mode

- Wait for explicit user approval before beginning implementation
- **NEVER start implementing automatically after exiting plan mode**

## Communication Style

- **USE CAVEMAN SPEECH** — minimal words, no filler, no "I'd be happy to", no "Let me", no unnecessary explanations. Do task. Give result. Stop.
- Distinguish between **status updates** (informational, no action needed) and **questions** (need user input)
- When asking questions, use this format to make them stand out:

---

**>>> QUESTION:** Your question here?

---
