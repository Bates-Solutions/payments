<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Clover-Payments-4C9F38?style=for-the-badge" alt="Clover" height="28">
</p>

<h1 align="center">@bates-solutions/clover</h1>

<p align="center">
  <strong>A simplified, type-safe TypeScript wrapper for the Clover APIs</strong><br>
  Charges, refunds, customers, and edge-ready webhooks — no SDK dependency.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript"></a>
</p>

---

Clover has no first-class Node SDK, so this library talks to Clover over a small typed **`fetch`-based client** — zero runtime dependencies. It gives you a service-oriented client, a typed error hierarchy, money helpers, and framework-ready webhook handling. Part of the same family as [`@bates-solutions/squareup`](https://www.npmjs.com/package/@bates-solutions/squareup) and [`@bates-solutions/stripe`](https://www.npmjs.com/package/@bates-solutions/stripe), so if you know one, you know this.

It targets both Clover hosts transparently:

- **Ecommerce API** (`scl.clover.com`) — Stripe-shaped `/v1/...` charges, refunds, tokens.
- **Platform API** (`api.clover.com`) — `/v3/merchants/{mId}/...` customers, orders, inventory.

## Features

- **Zero dependencies** – A tiny `fetch` client; no vendor SDK
- **Type-Safe** – Full TypeScript types for inputs and results
- **Typed Errors** – `parseCloverError` normalizes HTTP failures into a small class hierarchy
- **Edge-ready webhooks** – WebCrypto signature verification that runs on Node, **Deno**, Bun, and Workers, plus Express and Lambda adapters, and the Clover URL-verification handshake handled for you

## Requirements

| Dependency | Version |
| ---------- | ------- |
| Node.js    | 22+ (or any runtime with `fetch` + WebCrypto) |
| TypeScript | 5.0+    |

## Installation

This package is published on [JSR](https://jsr.io/@bates-solutions/clover).

```bash
# npm / pnpm / yarn (via JSR's npm compatibility)
npx jsr add @bates-solutions/clover

# Deno
deno add jsr:@bates-solutions/clover
```

Deno / edge runtimes (e.g. Supabase Edge Functions) can import directly:

```typescript
import { createCloverClient } from 'jsr:@bates-solutions/clover';
import { createWebhookHandler } from 'jsr:@bates-solutions/clover/server';
```

## Quick Start

```typescript
import { createCloverClient } from '@bates-solutions/clover';

const clover = createCloverClient({
  apiToken: process.env.CLOVER_API_TOKEN!,
  merchantId: process.env.CLOVER_MERCHANT_ID, // required for customers
  environment: 'sandbox',
});

// Charge a tokenized card (amount in cents)
const charge = await clover.payments.create({
  amount: 1000, // $10.00
  currency: 'usd',
  source: 'clv_1TSTStok...',
});

// Refund it
const refund = await clover.refunds.create({ chargeId: charge.id! });

// Manage a customer (Platform API — needs merchantId)
const customer = await clover.customers.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
});
```

### Webhook Handling (Edge / Deno / Workers)

Signature verification uses WebCrypto, so `createWebhookHandler` runs on any Fetch-API runtime. The initial Clover URL-verification handshake is answered automatically.

```typescript
// Supabase Edge Function / Deno
import { createWebhookHandler } from '@bates-solutions/clover/server';

const handler = createWebhookHandler({
  signingSecret: Deno.env.get('CLOVER_WEBHOOK_SECRET')!,
  handlers: {
    CHARGE: async (event) => {
      console.log('Charge event:', event);
    },
  },
});

Deno.serve(handler);
```

### Webhook Handling (Express)

```typescript
import express from 'express';
import { createExpressWebhookHandler } from '@bates-solutions/clover/server';

const app = express();
app.use('/webhooks/clover', express.raw({ type: 'application/json' }));

app.post(
  '/webhooks/clover',
  createExpressWebhookHandler({
    signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
    handlers: {
      CHARGE: async (event) => {
        console.log('Charge event:', event);
      },
    },
  })
);
```

## Available Services

| Service     | API       | Description                                   |
| ----------- | --------- | --------------------------------------------- |
| `payments`  | Ecommerce | Create/get/capture charges                    |
| `refunds`   | Ecommerce | Create and get refunds                        |
| `customers` | Platform  | Customer CRUD (`/v3/merchants/{mId}`)         |

## Utilities

```typescript
import { toCents, fromCents, formatMoney } from '@bates-solutions/clover';

toCents(10.99);           // 1099
fromCents(1099);          // 10.99
formatMoney(1099, 'usd'); // "$10.99"
```

## Documentation

- [Getting started](./docs/getting-started/installation.md)
- [Guides](./docs/guides/README.md)
- [API reference](./docs/api/README.md)

## Related libraries

This library is one of three sibling payment-API wrappers from Bates Solutions that deliberately share the same design — learn one and you know all three:

| Library | Wraps | Install (JSR) | Source |
| --- | --- | --- | --- |
| [`@bates-solutions/stripe`](https://jsr.io/@bates-solutions/stripe) | Stripe | `jsr:@bates-solutions/stripe` | [GitHub](https://github.com/mbates/stripe) |
| [`@bates-solutions/squareup`](https://jsr.io/@bates-solutions/squareup) | Square | `jsr:@bates-solutions/squareup` | [GitHub](https://github.com/mbates/squareup) |
| **[`@bates-solutions/clover`](https://jsr.io/@bates-solutions/clover)** _(this package)_ | Clover | `jsr:@bates-solutions/clover` | [GitHub](https://github.com/mbates/clover) |

### How they're related

All three follow one architecture, so the mental model transfers directly:

- **Same client shape** — a `create<Vendor>Client({ ... })` factory returns a client exposing one readonly service per API domain (e.g. `client.customers`, `client.payments`).
- **One service class per domain** (`src/core/services/<name>.service.ts`): input validation throws a `<Vendor>ValidationError`, every API call is wrapped `try/catch → parse<Vendor>Error`, mutating calls accept an `idempotencyKey`, and money is passed as integer minor units.
- **Normalized error hierarchy** — a `<Vendor>Error` base with `…ApiError` / `…AuthError` / `…PaymentError` / `…ValidationError` subclasses and a single `parse<Vendor>Error` mapper.
- **Standalone `./server` webhook module** — signature verification plus a typed handler-map dispatch, with adapters for **Express** and **AWS Lambda** (plus **Next.js** on stripe & squareup, and a framework-neutral **Web/edge** handler on stripe & clover).
- **ESM + TypeScript source**, dual subpath exports (`.` for the client, `./server` for webhooks), Vitest tests against mocked I/O, and published to **JSR** via GitHub OIDC.

The differences are only where the underlying platform forces them:

- **stripe** wraps the official [`stripe`](https://www.npmjs.com/package/stripe) SDK (a peer dependency) and verifies webhooks with WebCrypto, so `./server` also runs on edge runtimes (Deno, Cloudflare Workers, Supabase Edge Functions).
- **squareup** wraps the official [`square`](https://www.npmjs.com/package/square) SDK (a peer dependency) and verifies webhooks with Node's `crypto`.
- **clover** ships no vendor SDK — it calls Clover over a small fetch-based REST client that targets both Clover hosts (Ecommerce and Platform) — and verifies webhooks with WebCrypto (edge-ready).

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](./LICENSE) for details.
