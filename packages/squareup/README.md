<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Square-Payments-0066CC?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNjZDQyIvPgo8cGF0aCBkPSJNOC41IDEySDE1LjVWMTMuNUgxMC41VjE1SDE1LjVWMTYuNUgxMC41VjE4SDE1LjVWMTlIMFYxMkg4LjVWMTJIMFYxMkg4LjVWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K&style=for-the-badge" alt="Square" height="28">
</p>

<h1 align="center">@bates-solutions/squareup</h1>

<p align="center">
  <strong>The modern TypeScript SDK for Square payments</strong><br>
  Build payment backends with type-safe APIs, fluent builders, and webhook support.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript"></a>
</p>

---

Stop wrestling with Square's low-level APIs. **squareup** gives you a simplified client API and fluent builders that make payment integration straightforward. Process payments, manage orders, handle webhooks. All with full TypeScript support and zero boilerplate.

## Features

- **Simplified APIs** - Less boilerplate, more productivity
- **Type-Safe** - Full TypeScript support with strict types
- **Fluent Builders** - Chainable order and payment construction
- **Webhook Support** - Signature verification (with signature key rotation) plus adapters for Express, Next.js, AWS Lambda, and a framework-neutral Web/edge handler (Deno, Supabase Edge Functions, Cloudflare Workers, Bun)
- **OAuth** - Authorize URL, code exchange, refresh, revoke and token status for multi-tenant apps ([guide](./docs/guides/core/oauth.md))
- **Service Classes** - Payments, Cards on file, Refunds, Orders, Customers, Customer Groups, Catalog (incl. pricing rules and subscription plan listing), Inventory, Subscriptions, Invoices, Loyalty, Gift Cards

## Requirements

| Dependency | Version |
| ---------- | ------- |
| Square SDK | `>=45.0.1 <47` (`square@45` or `square@46`) |
| Node.js    | 22+     |
| TypeScript | 5.0+    |

> **Upgrading from 1.x?** 2.x requires `square@45` or later, which changed the Inventory API. Your wrapper code keeps working. See [Upgrading from 1.x](./docs/guides/core/inventory.md#upgrading-from-1x). Deploying on AWS Lambda? See [Bundle Size & Memory](./docs/guides/deployment/lambda-bundle-size.md).

## Installation

This package is published on [JSR](https://jsr.io/@bates-solutions/squareup).

```bash
# npm / pnpm / yarn (via JSR's npm compatibility)
npx jsr add @bates-solutions/squareup

# Deno
deno add jsr:@bates-solutions/squareup
```

Then install the Square SDK, which is a peer dependency:

```bash
npm install square
```

> Previously published on npm as `@bates-solutions/squareup`; that package is
> deprecated in favor of JSR.

### TypeScript module resolution

JSR's npm tarball ships with `exports` only (no legacy `main`/`types`). Set your
`tsconfig.json` to a modern resolver so both entry points resolve:

```jsonc
{
  "compilerOptions": {
    // "Bundler" or "Node16"/"NodeNext" — the legacy "Node" (node10) resolver
    // cannot read the "exports" map and will report TS2307 for both `.` and `./server`.
    "moduleResolution": "Bundler"
  }
}
```

### Importing the server webhook helpers

`@bates-solutions/squareup/server` re-exports every helper — signature
verification, the typed dispatcher, and the Web, Express, Next.js, and Lambda
adapters. Framework adapters are **also** available as their own subpaths, so a
Lambda or Next.js app never pulls Express's types (or vice versa). On an edge
runtime, import from `./server/web`: it pulls in no Node built-in.

```ts
import { createWebhookHandler }        from '@bates-solutions/squareup/server/web';
import { createLambdaWebhookHandler } from '@bates-solutions/squareup/server/lambda';
import { createNextWebhookHandler }   from '@bates-solutions/squareup/server/nextjs';
import { createExpressWebhookHandler } from '@bates-solutions/squareup/server/express';
```

## Quick Start

### Basic Usage

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const client = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
});

// Process a payment
const payment = await client.payments.create({
  sourceId: 'cnon:card-nonce',
  amount: 1000, // $10.00
  currency: 'USD',
  idempotencyKey: 'order-1042', // one key per order, so a retry can't charge twice
});

// Money-moving calls (payments.create, refunds.refundPayment, cards.create,
// subscriptions.create) require an idempotencyKey. Keep it and reuse it if you
// retry the same request, so Square never charges twice.

// Refund part of it
await client.refunds.refundPayment({
  paymentId: payment.id!,
  amountMoney: { amount: 500 },
  idempotencyKey: `refund-${payment.id!}`,
});

// Create an order with the fluent builder
const order = await client.orders.create(
  client.orders
    .builder()
    .addItem({ name: 'Coffee', quantity: 2, amount: 450 })
    .addItem({ name: 'Muffin', quantity: 1, amount: 350 })
    .build()
);

// Search recent completed orders
const { data: orders } = await client.orders.searchRecent({
  states: ['COMPLETED'],
  since: new Date(Date.now() - 60 * 60 * 1000), // last hour
});

// Manage customers
const customer = await client.customers.create({
  givenName: 'John',
  familyName: 'Doe',
  emailAddress: 'john@example.com',
});

// List customers with pagination
const page1 = await client.customers.list({ limit: 50 });
const page2 = await client.customers.list({ cursor: page1.cursor, limit: 50 });

// List customers sorted by creation time, newest first
const recent = await client.customers.list({ sortField: 'CREATED_AT', sortOrder: 'DESC' });

// Search customers by name, email, company, or city
const results = await client.customers.search({ query: 'john doe' });
```

Square signs `notificationUrl + rawBody`, so pass `notificationUrl` set to the
exact URL registered on your webhook subscription.

While you rotate the signature key, pass both keys: `signatureKey: [newKey,
oldKey]`. A signature that matches either is valid, in every verifier and
adapter. A single string works as before.

### Webhook Handling (Edge: Deno, Supabase Edge Functions, Cloudflare Workers, Bun)

`createWebhookHandler` takes a standard `Request` and returns a standard
`Response`. It verifies with WebCrypto and uses only Web APIs, so it runs on any
Fetch API runtime:

```typescript
import { createWebhookHandler } from '@bates-solutions/squareup/server/web';

Deno.serve(createWebhookHandler({
  signatureKey: Deno.env.get('SQUARE_WEBHOOK_SIGNATURE_KEY')!,
  notificationUrl: 'https://example.supabase.co/functions/v1/square-webhook',
  handlers: {
    'payment.updated': async (event) => {
      console.log('Payment updated:', event.data.id);
    },
  },
}));
```

### Webhook Handling (Express)

```typescript
import express from 'express';
import { createExpressWebhookHandler } from '@bates-solutions/squareup/server';

const app = express();

// Raw body parser on the webhook route, before any JSON parsing
app.use('/webhooks/square', express.raw({ type: 'application/json' }));

app.post('/webhooks/square', createExpressWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
  notificationUrl: 'https://example.com/webhooks/square',
  handlers: {
    'payment.updated': async (event) => {
      console.log('Payment updated:', event.data.id);
    },
    'order.created': async (event) => {
      console.log('Order created:', event.data.id);
    },
  },
}));
```

### Webhook Handling (Next.js)

```typescript
// app/api/webhooks/square/route.ts
import { createNextWebhookHandler } from '@bates-solutions/squareup/server';

export const POST = createNextWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
  notificationUrl: 'https://example.com/api/webhooks/square',
  handlers: {
    'payment.updated': async (event) => {
      console.log('Received event:', event.type);
    },
  },
});
```

### Custom Handling (`verifySignature` / `verifySignatureAsync`)

On Node, `verifySignature` is synchronous (Node `crypto`). On an edge runtime,
use `verifySignatureAsync` from `./server/web`: the same check with WebCrypto,
returning a `Promise`.

```typescript
import { verifySignature, parseWebhookEvent } from '@bates-solutions/squareup/server';

const result = verifySignature(rawBody, signature, signatureKey, notificationUrl);
if (!result.valid) {
  return new Response(result.error, { status: 401 });
}
const event = parseWebhookEvent(rawBody);
```

```typescript
// Edge
import { verifySignatureAsync } from '@bates-solutions/squareup/server/web';

const result = await verifySignatureAsync(rawBody, signature, signatureKey, notificationUrl);
```

### Typed Webhook Payloads

```typescript
import type { PaymentWebhookEvent } from '@bates-solutions/squareup/server';
import { getOrderId, getCustomerId, parseWebhookEvent } from '@bates-solutions/squareup/server';

// Cast to typed event for full payload types — no `as any` needed
const event = parseWebhookEvent(rawBody) as PaymentWebhookEvent;
const payment = event.data.object.payment;
console.log(payment.status, payment.amount_money);

// Or use helpers to extract entity IDs from any event type
const orderId = getOrderId(event);     // works on payment, order, and refund events
const customerId = getCustomerId(event); // works on payment and customer events
```

### Webhook Handling (AWS Lambda)

```typescript
import { createLambdaWebhookHandler } from '@bates-solutions/squareup/server';

export const handler = createLambdaWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
  notificationUrl: 'https://api.example.com/webhooks/square', // required
  handlers: {
    'payment.completed': async (event, context) => {
      // context.orderId, context.customerId auto-extracted
      await processPayment(event.data.id, context.orderId!);
    },
  },
});
```

A handler that throws makes the Lambda return `500`, so Square retries the
delivery; make handlers idempotent (for example on `event.event_id`).

## Available Services

| Service          | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `payments`       | Process and manage payments                                    |
| `cards`          | Cards on file: store, get, list and disable a customer's cards |
| `refunds`        | Refund payments, and get or list refunds                       |
| `orders`         | Create and manage orders, incl. DRAFT templates for subscriptions, fulfillment updates and cancelling |
| `customers`      | Customer management                                            |
| `customerGroups` | Customer groups + group membership (gates pricing rules)       |
| `catalog`        | Product catalog ops, incl. pricing rules, wholesale pricing and UPC/SKU lookup |
| `inventory`      | Stock counts, adjustments and transfers between locations      |
| `subscriptions`  | Subscription management, incl. phases backed by order templates |
| `invoices`       | Invoice operations                                             |
| `loyalty`        | Loyalty program management                                     |
| `checkout`       | Hosted checkout sessions                                       |
| `giftCards`      | Gift card lifecycle (issue, activate, load, redeem, deactivate) + activities |
| `locations`      | List/get merchant locations (derive currency, country, status) |
| `oauth`          | Token status for the client's access token (`tokenStatus()`). Code exchange, refresh and revoke are on `createSquareOAuthClient` |
| `webhooks`       | Webhook subscription management (`webhooks.subscriptions`: create/list/update/delete/test/rotate key) |

## Error Handling

Every call throws a typed `SquareError` subclass: `SquareValidationError`, `SquareAuthError`, `SquarePaymentError`, `SquareApiError`, or `SquareNetworkError` when no response arrived (connection failure or timeout). `SquareError` extends `PaymentsError` (also exported here, from `@bates-solutions/payments-core`), so one `instanceof PaymentsError` check catches errors from any of the three provider packages, even when they install different copies of `@bates-solutions/payments-core`. `isRetryableSquareError(error)` tells you whether a retry could succeed. When retrying a mutating call, pass the same `idempotencyKey`. For a card decline, `declineReason(error)` gives Square's code and whether charging the same card again later can succeed (for example `INSUFFICIENT_FUNDS` yes, after a few days; `GENERIC_DECLINE` no). See [Errors and Retries](./docs/guides/core/errors.md).

## Utilities

```typescript
import { toCents, fromCents, formatMoney } from '@bates-solutions/squareup';

toCents(10.99);           // 1099
fromCents(1099);          // 10.99
formatMoney(1099, 'USD'); // "$10.99"
```

## Upgrading from 2.x to 3.0

3.0 has two breaking changes. Everything else in 3.0 is additive.

### 1. `idempotencyKey` is required on calls that move money or store a card

`payments.create`, `subscriptions.create`, `cards.create` and `refunds.refundPayment` no longer make up a random key. A random key made on each call can't stop a retry from charging twice, so a missing key is now a type error, and an empty one throws `SquareValidationError`. `cards` and `refunds` are new in 3.0, so only `payments.create` and `subscriptions.create` affect existing code.

Pass a key that stays the same when the same request is retried, for example one derived from your order or checkout ID:

```typescript
// 2.x
await square.payments.create({ sourceId, amount: 1099 });

// 3.0
await square.payments.create({ sourceId, amount: 1099, idempotencyKey: `order-${orderId}` });
await square.subscriptions.create({ customerId, planVariationId, idempotencyKey: `sub-${userId}-${planVariationId}` });
```

`createIdempotencyKey()` still makes a random key. Use it only when you store the key with the request and reuse it on a retry. Keys are at most 45 characters. The other calls that take a key (`orders.pay`, gift card activities, invoices, checkout and catalog) still default it to a random one, so pass your own when a retry must not repeat the call. `orders.pay` and gift card `LOAD` and `ACTIVATE` activities move money.

### 2. The Lambda adapter requires `notificationUrl` and returns `500` when a handler throws

- `createLambdaWebhookHandler` throws at setup when `notificationUrl` is missing or empty. Square signs `notificationUrl + rawBody`, so without it no real delivery could verify. Set it to the URL registered on the webhook subscription, exactly as registered.
- A handler (or `onUnhandledEvent`) that throws now makes the Lambda return `500`, so Square retries the delivery. 2.x returned `200` and the event was lost. Make handlers idempotent, for example on `event.event_id`, since a retry can run one again.

## Documentation

- [Getting started](./docs/getting-started/installation.md)
- [Guides](./docs/guides/README.md)
- [API reference](https://bates-solutions.github.io/payments/squareup/) (also [in this repo](./docs/api/README.md), as markdown)

## Related libraries

This library is one of three sibling payment-API wrappers from Bates Solutions that deliberately share the same design — learn one and you know all three:

| Library | Wraps | Install (JSR) | Source |
| --- | --- | --- | --- |
| [`@bates-solutions/stripe`](https://jsr.io/@bates-solutions/stripe) | Stripe | `jsr:@bates-solutions/stripe` | [GitHub](https://github.com/Bates-Solutions/payments/tree/main/packages/stripe) |
| **[`@bates-solutions/squareup`](https://jsr.io/@bates-solutions/squareup)** _(this package)_ | Square | `jsr:@bates-solutions/squareup` | [GitHub](https://github.com/Bates-Solutions/payments/tree/main/packages/squareup) |
| [`@bates-solutions/clover`](https://jsr.io/@bates-solutions/clover) | Clover | `jsr:@bates-solutions/clover` | [GitHub](https://github.com/Bates-Solutions/payments/tree/main/packages/clover) |

### How they're related

All three follow one architecture, so the mental model transfers directly:

- **Same client shape** — a `create<Vendor>Client({ ... })` factory returns a client exposing one readonly service per API domain (e.g. `client.customers`, `client.payments`).
- **One service class per domain** (`src/core/services/<name>.service.ts`): input validation throws a `<Vendor>ValidationError`, every API call is wrapped `try/catch → parse<Vendor>Error`, mutating calls accept an `idempotencyKey`, and money is passed as integer minor units.
- **Normalized error hierarchy** — a `<Vendor>Error` base (extending core's `PaymentsError`) with `…ApiError` / `…AuthError` / `…PaymentError` / `…ValidationError` subclasses and a single `parse<Vendor>Error` mapper.
- **Standalone `./server` webhook module** — signature verification plus a typed handler-map dispatch, with adapters for **Express** and **AWS Lambda** (plus **Next.js** on stripe & squareup), and a framework-neutral **Web/edge** handler on all three.
- **ESM + TypeScript source**, dual subpath exports (`.` for the client, `./server` for webhooks), Vitest tests against mocked I/O, and published to **JSR** via GitHub OIDC.

The differences are only where the underlying platform forces them:

- **stripe** wraps the official [`stripe`](https://www.npmjs.com/package/stripe) SDK (a peer dependency) and verifies webhooks with WebCrypto, so `./server` also runs on edge runtimes (Deno, Cloudflare Workers, Supabase Edge Functions).
- **squareup** wraps the official [`square`](https://www.npmjs.com/package/square) SDK (a peer dependency) and verifies webhooks with Node's `crypto` in its Node adapters, plus a WebCrypto path (`./server/web`) for edge runtimes (Deno, Cloudflare Workers, Supabase Edge Functions).
- **clover** ships no vendor SDK — it calls Clover over a small fetch-based REST client that targets both Clover hosts (Ecommerce and Platform) — and verifies webhooks with WebCrypto (edge-ready).

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](./LICENSE) for details.
