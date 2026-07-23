# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

`@bates-solutions/clover` — TypeScript wrapper around the Clover **Ecommerce** and **Platform** APIs with webhook helpers for Node.js and edge runtimes. Single-package library published to **JSR** (`jsr:@bates-solutions/clover`); JSR publishes the TypeScript source directly, so there is no build/bundle step for distribution. Sibling to `@bates-solutions/squareup` (on npm) and `@bates-solutions/stripe` (on JSR), and intentionally mirrors their shape so consumers of one know all.

Clover has no first-class Node SDK, so this library talks to Clover over a small typed **fetch-based REST client** (`src/core/http.ts`) — no vendor SDK dependency.

**Two Clover hosts (the http client targets both):**

- **ecommerce** (`scl-sandbox.dev.clover.com` / `scl.clover.com`) — Stripe-shaped `/v1/...` endpoints: charges, refunds, tokens. Amounts in cents, lowercase ISO currency, token `source`. No merchant id in the path.
- **platform** (`apisandbox.dev.clover.com` / `api.clover.com`) — `/v3/merchants/{mId}/...` endpoints: customers, orders, inventory. Needs `merchantId`.

**Structure:**

- `src/core/` — http client, main client, services (one per domain), errors, utils, types
- `src/core/services/` — service classes calling `http`
- `src/core/__tests__/` — vitest tests mirroring service files (mock `fetch` — no real network)
- `src/server/` — webhook signature verification + handlers (edge-ready via WebCrypto)
- `docs/guides/` — usage guides; `docs/api/` — generated API docs

## Commands

```bash
npm run build        # tsc → dist/
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src
npm run lint:fix     # eslint src --fix
npm test             # vitest run
npm run test:coverage
npm run docs         # typedoc
```

Always run `typecheck`, `lint`, and `test` before committing.

## Conventions

- Package manager: `npm`. No runtime dependencies (uses global `fetch`/WebCrypto — Node 22+, Deno, Workers).
- One service class per Clover domain in `src/core/services/<name>.service.ts`.
- All `http` calls wrapped in `try/catch` → `parseCloverError(error)`.
- Mutating endpoints accept `idempotencyKey?` and default to `createIdempotencyKey()` (sent as the `idempotency-key` header).
- Input validation throws `CloverValidationError`.
- Money amounts: integer cents (`number`); currency is lowercase ISO (e.g. `usd`).
- Webhook signature verification uses WebCrypto (`crypto.subtle`) so `./server` runs on edge runtimes, not just Node. Clover's Hosted-Checkout signature scheme matches Stripe's (`Clover-Signature: t=…,v1=…` over `${ts}.${body}`).
- New services must be wired into `src/core/client.ts` and exported from `src/core/index.ts`.

## Git Commits & PRs

- **ALWAYS create a PR for code changes** — never push directly to `main`.
- Do NOT include "Generated with Claude Code" or `Co-Authored-By` lines mentioning Claude/Anthropic.
- Conventional commit prefixes (`feat:`, `fix:`, `chore:`, …). Publishing goes to JSR via OIDC (`.github/workflows/publish-jsr.yml`), triggered by pushing a `v*` tag. To release: bump `version` in `jsr.json` (keep `package.json` in sync), merge, then tag `vX.Y.Z` and push the tag.

## Documentation

Public library (published on JSR) — every PR that adds or changes public API surface updates docs in the same PR (`README.md`, `docs/guides/core/<service>.md`, JSDoc; TypeDoc regenerates `docs/api/`).
