# Bundle Size & Memory on AWS Lambda

If you deploy this library in AWS Lambda, the dominant cost is the underlying
`square` SDK, not this wrapper. This page explains what's real, what isn't, and
the levers you actually have.

## The measurements

On Node 22, RSS delta from `require()` (the `square` SDK dominates; this wrapper's
own runtime cost is negligible):

| What you load | RSS delta |
| ------------- | --------- |
| `require('square')` (all 36 API namespaces) | **~80 MB** |
| A single namespace client (e.g. `catalog`) | **~78 MB** |
| The SDK `core` only | ~18 MB |

By bundle size the split is similar: the wrapper's own contribution is ~0.09 MB
(about 1%); the `square` SDK is ~6.5 MB of a typical Lambda bundle (about 77%).

## Why it does not tree-shake, and why "lazy require" won't help

The `square` SDK is Fern-generated **CommonJS** with `sideEffects: false` (which
does nothing for CJS) and an `exports` map that only exposes `.` / `./legacy`
(so you can't import a single namespace). Its generated `Client.js` `require`s
all 36 namespace clients at module top level.

The tempting fix — moving those 36 `require`s into their lazy getters — **saves
only ~4 MB**. The measurements above show why: loading **one** namespace already
costs ~78 MB. Every generated namespace client does:

```js
const serializers = __importStar(require("../../../../serialization/index"));
```

i.e. it eagerly imports the **entire** serialization barrel for the whole SDK
(~60 MB), not just its own schemas. So the first namespace you touch loads all
of serialization regardless of how the top-level client requires things. The
only fix that would move RSS is upstream: Fern/Square scoping serializer imports
per-namespace (or making them lazy). Tracked as an upstream request.

## What you can actually do

### 1. Mark `square` external (cuts the artifact, not RSS)

Marking the SDK external removes ~6.5 MB from the deployment package. It does
**not** reduce runtime RSS — the modules still load — but a smaller artifact
means faster cold-start downloads and lets you share the SDK via a layer.

esbuild:

```bash
esbuild handler.ts --bundle --platform=node --target=node22 --external:square
```

Then ship `square` in a **Lambda layer** (or `node_modules`) so it resolves at
runtime.

### 2. Right-size memory

Bare Node 22 is ~44 MB RSS; the SDK adds ~80 MB; then your code. Budget your
Lambda memory accordingly — a 128 MB function has little headroom left once the
SDK loads. Bumping memory is the honest operational stopgap until the upstream
serialization change lands.

### 3. Pin `square@44`

This wrapper supports `square` `>=43.2.1 <45`. **`square@45` is not yet
supported** — it makes breaking changes to the Inventory API types
(`InventoryAdjustment.locationId` → `toLocationId`; `InventoryChangeType` drops
`TRANSFER`). Pin `square@^44` until wrapper support for 45 lands. Installing a
`square@45` alongside this wrapper is an unsupported combination.

## Summary

- The ~80 MB RSS is the `square` SDK eagerly loading its full serialization
  layer; it is **not** fixable in this wrapper or by tree-shaking / lazy-require.
- `--external:square` + a layer trims the **artifact** (~6.5 MB), not RSS.
- Right-size memory; pin `square@44`.
- The real RSS fix is an upstream Fern/Square change to scope serializer imports.
