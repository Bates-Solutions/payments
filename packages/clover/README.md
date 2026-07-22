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

```bash
npm install @bates-solutions/clover
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

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](./LICENSE) for details.
