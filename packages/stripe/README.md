<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white&style=for-the-badge" alt="Stripe" height="28">
</p>

<h1 align="center">@bates-solutions/stripe</h1>

<p align="center">
  <strong>A simplified, type-safe TypeScript wrapper for the Stripe API</strong><br>
  Build payment backends with less boilerplate, typed errors, and webhook support.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript"></a>
</p>

---

A thin, consistent wrapper over the official [`stripe`](https://www.npmjs.com/package/stripe) Node SDK. It gives you a small service-oriented client, a typed error hierarchy, money helpers, and framework-ready webhook handling — while staying out of the way when you need the raw SDK. Part of the same family as [`@bates-solutions/squareup`](https://jsr.io/@bates-solutions/squareup), so if you know one, you know this.

## Features

- **Simplified APIs** – Less boilerplate over payments, subscriptions, hosted checkout, and billing
- **Type-Safe** – Full TypeScript support; wraps Stripe's own types
- **Typed Errors** – `parseStripeError` normalizes Stripe errors into a small class hierarchy with stable codes (see the [errors guide](./docs/guides/core/errors.md))
- **Edge-ready webhooks** – WebCrypto signature verification that runs on Node, **Deno**, Bun, and Workers, plus Express / Next.js / Lambda adapters
- **Version-stable subscriptions** – Normalized shape with `Date` period fields, absorbing Stripe's API churn
- **Connected accounts** – Connect OAuth helpers and `client.forAccount(id)`, which runs every service as a connected account
- **Escape Hatch** – `client.sdk` exposes the underlying Stripe instance for anything not wrapped

## Requirements

| Dependency | Version |
| ---------- | ------- |
| Stripe SDK | 18–23   |
| Node.js    | 22+     |
| TypeScript | 5.0+    |

## Installation

This package is published on [JSR](https://jsr.io/@bates-solutions/stripe).

```bash
# npm / pnpm / yarn (via JSR's npm compatibility)
npx jsr add @bates-solutions/stripe

# Deno
deno add jsr:@bates-solutions/stripe
```

Then install the Stripe SDK, which is a peer dependency:

```bash
npm install stripe          # Node
# or, in Deno, import via npm:stripe
```

Deno / edge runtimes (e.g. Supabase Edge Functions) can import directly:

```typescript
import { createStripeClient } from 'jsr:@bates-solutions/stripe';
import { createWebhookHandler } from 'jsr:@bates-solutions/stripe/server';
```

## Quick Start

### Basic Usage

```typescript
import { createStripeClient } from '@bates-solutions/stripe';

const client = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

// Process a payment (PaymentIntent)
const payment = await client.payments.create({
  amount: 1000, // $10.00 in cents
  currency: 'usd',
  paymentMethod: 'pm_card_visa',
  confirm: true,
});

// Manage customers
const customer = await client.customers.create({
  email: 'john@example.com',
  name: 'John Doe',
});

// Refund a payment
const refund = await client.refunds.create({
  paymentIntentId: payment.id,
});

// Paginate
const page1 = await client.customers.list({ limit: 50 });
const page2 = await client.customers.list({ startingAfter: page1.nextCursor });
```

### Hosted subscription billing

```typescript
// Send the customer to Stripe-hosted Checkout to subscribe
const session = await client.checkout.create({
  mode: 'subscription',
  customerId: 'cus_123',
  lineItems: [{ price: 'price_123', quantity: 1 }],
  successUrl: 'https://app.example.com/billing?success=true',
  cancelUrl: 'https://app.example.com/billing?canceled=true',
});
redirect(session.url);

// Let them manage it in the billing portal
const portal = await client.billingPortal.create({
  customerId: 'cus_123',
  returnUrl: 'https://app.example.com/account',
});

// Read a subscription with period fields already as JS Dates
const sub = await client.subscriptions.get('sub_123');
sub.status; // 'active'
sub.priceId; // 'price_123'
sub.currentPeriodEnd; // Date

// Read your catalog from Stripe (products expanded)
const { data: prices } = await client.prices.list({ active: true, expandProduct: true });
```

### Managing the catalog

```typescript
const product = await client.products.create({
  name: 'Sourdough loaf',
  metadata: { sku: 'SD-001' }, // tag it with your own id
});
const price = await client.prices.create({
  product: product.id,
  unitAmount: 899,
  currency: 'usd',
});

// Prices are immutable: replace creates a new one and deactivates the old one
const { price: newPrice } = await client.prices.replace(price.id, { unitAmount: 949 });

await client.products.archive(product.id);
```

### Connected accounts (Connect)

```typescript
import { buildAuthorizeUrl } from '@bates-solutions/stripe';

// 1. Send the user to Stripe to connect their account
const state = crypto.randomUUID(); // store it server side for the callback
const url = buildAuthorizeUrl({ clientId: 'ca_123', state });

// 2. In the redirect handler: require the stored state, delete it (one use),
//    compare it with the query value, handle `error`, require a string `code`
//    (full example in docs/guides/core/connect.md)
const { stripeUserId } = await client.oauth.exchangeCode(code);

// 3. Act as the connected account: every call sends Stripe-Account
const retailer = client.forAccount(stripeUserId);
await retailer.products.list();
```

### Reading what was sold

```typescript
// Completed Checkout Sessions (including Payment Link sales) in a window.
// list returns one page, so follow nextCursor to cover the whole window.
const march = { gte: new Date('2026-03-01'), lt: new Date('2026-04-01') };
let cursor: string | undefined;
do {
  const page = await client.checkout.list({
    status: 'complete',
    created: march,
    limit: 100,
    startingAfter: cursor,
  });
  for (const session of page.data) {
    const items = await client.checkout.listLineItems(session.id); // all of its pages
  }
  cursor = page.nextCursor;
} while (cursor);

// Paid invoices and their lines, the same way
cursor = undefined;
do {
  const page = await client.invoices.list({
    status: 'paid',
    created: march,
    limit: 100,
    startingAfter: cursor,
  });
  for (const invoice of page.data) {
    const lines = await client.invoices.listLines(invoice.id);
  }
  cursor = page.nextCursor;
} while (cursor);
```

### Saving a card for later

```typescript
// Server: create a SetupIntent and hand its client secret to Stripe.js
const intent = await client.setupIntents.create({ customerId: 'cus_123' });
// ...the browser confirms it with stripe.confirmCardSetup(intent.client_secret)

// Later: list the saved cards and make one the default
const { data: cards } = await client.paymentMethods.list({ customerId: 'cus_123', type: 'card' });
await client.paymentMethods.setDefault('cus_123', cards[0].id);
```

### Webhook Handling (Express)

```typescript
import express from 'express';
import { createExpressWebhookHandler } from '@bates-solutions/stripe/server';

const app = express();

// Raw body is required for signature verification
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

app.post(
  '/webhooks/stripe',
  createExpressWebhookHandler({
    signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    handlers: {
      'payment_intent.succeeded': async (event) => {
        // event.data.object is typed as a Stripe.PaymentIntent
        console.log('Paid:', event.data.object.id);
      },
    },
  })
);
```

### Webhook Handling (Next.js App Router)

```typescript
// app/api/webhooks/stripe/route.ts
import { createNextWebhookHandler } from '@bates-solutions/stripe/server';

export const POST = createNextWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
});
```

### Webhook Handling (AWS Lambda)

```typescript
import { createLambdaWebhookHandler } from '@bates-solutions/stripe/server';

export const handler = createLambdaWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event, context) => {
      // context.paymentIntentId / context.customerId auto-extracted
      await fulfillOrder(context.paymentIntentId!);
    },
  },
});
```

### Webhook Handling (Edge / Deno / Workers)

Signature verification uses WebCrypto, so `createWebhookHandler` runs on any
runtime that speaks the Fetch API — Deno, Cloudflare Workers, Bun, and edge
functions — with no Node built-ins.

```typescript
// Supabase Edge Function / Deno
import { createWebhookHandler } from '@bates-solutions/stripe/server';

const handler = createWebhookHandler({
  signingSecret: Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
  handlers: {
    'checkout.session.completed': async (event) => {
      console.log('Subscribed:', event.data.object.id);
    },
  },
});

Deno.serve(handler);
```

Entity helpers extract common IDs from any event: `getPaymentIntentId`,
`getChargeId`, `getCustomerId`, `getSubscriptionId`, `getInvoiceId`, `getAccountId`
(the connected account of a Connect event), and `resolveId` (collapses
an id-string-or-expanded-object reference). `fromUnixTime(seconds)` converts
Stripe's epoch-seconds timestamps to a `Date`.

## Available Services

| Service          | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| `payments`       | Create and manage payments (PaymentIntents)                              |
| `customers`      | Customer management + search                                             |
| `refunds`        | Create and list refunds                                                  |
| `checkout`       | Hosted Checkout Sessions (subscription & one-time), sold line items      |
| `billingPortal`  | Customer billing portal sessions                                         |
| `subscriptions`  | Get, list, cancel subscriptions, normalized with `Date`s                 |
| `prices`         | List, retrieve, create, update, archive and replace prices               |
| `products`       | List, retrieve, create, update and archive products                      |
| `invoices`       | Invoices + invoice items (create, finalize, pay, void, send, read lines) |
| `paymentLinks`   | Read Payment Links and their line items                                  |
| `oauth`          | Connect OAuth: exchange a code, deauthorize an account                   |
| `paymentMethods` | Saved payment methods: list, attach, detach, set the default             |
| `setupIntents`   | Save a payment method for later (off-session) charges                    |

## Utilities

```typescript
import { toMinor, fromMinor, formatMoney, toUnixTime } from '@bates-solutions/stripe';

toMinor(10.99); // 1099
fromMinor(1099); // 10.99
formatMoney(1099, 'usd'); // "$10.99"

toMinor(5000, 'KRW'); // 5000 (zero-decimal; codes are case-insensitive)
toMinor(5.124, 'kwd'); // 5120 (three-decimal, rounded to a multiple of 10)
toMinor(5, 'isk'); // 500  (sent as two-decimal, decimals always 00)

toUnixTime(new Date('2026-03-01T00:00:00Z')); // 1772323200 (Stripe's time format)
```

`toMinor` and `fromMinor` follow [Stripe's currency rules](https://docs.stripe.com/currencies):

| Currencies                                                                  | Stripe `amount`                           | Example            |
| --------------------------------------------------------------------------- | ----------------------------------------- | ------------------ |
| Two-decimal (default, e.g. `usd`, `eur`, `huf`, `twd`)                      | major × 100                               | 10.99 USD → `1099` |
| Zero-decimal: `bif clp djf gnf jpy kmf krw mga pyg rwf vnd vuv xaf xof xpf` | major × 1                                 | 500 JPY → `500`    |
| Three-decimal: `bhd jod kwd omr tnd`                                        | major × 1000, rounded to a multiple of 10 | 5.124 KWD → `5120` |
| `isk`, `ugx`                                                                | whole units × 100 (decimals always `00`)  | 5 ISK → `500`      |

`huf` and `twd` charges take two-decimal amounts, but Stripe payouts in those currencies must be multiples of 100; the helpers don't enforce that.

`toMinor` rounds half away from zero, so a credit mirrors its charge (`toMinor(-5.5, 'isk')` is `-600`), and never returns `-0`. The helpers throw `StripeValidationError` for a missing or empty currency, and `toMinor` also throws for a `NaN` or infinite amount or a result beyond `Number.MAX_SAFE_INTEGER`.

## Documentation

- [Getting started](./docs/getting-started/installation.md)
- [Guides](./docs/guides/README.md)
- [API reference](./docs/api/README.md)

## Related libraries

This library is one of three sibling payment-API wrappers from Bates Solutions that deliberately share the same design — learn one and you know all three:

| Library                                                                                  | Wraps  | Install (JSR)                   | Source                                                |
| ---------------------------------------------------------------------------------------- | ------ | ------------------------------- | ----------------------------------------------------- |
| **[`@bates-solutions/stripe`](https://jsr.io/@bates-solutions/stripe)** _(this package)_ | Stripe | `jsr:@bates-solutions/stripe`   | [GitHub](https://github.com/Bates-Solutions/stripe)   |
| [`@bates-solutions/squareup`](https://jsr.io/@bates-solutions/squareup)                  | Square | `jsr:@bates-solutions/squareup` | [GitHub](https://github.com/Bates-Solutions/squareup) |
| [`@bates-solutions/clover`](https://jsr.io/@bates-solutions/clover)                      | Clover | `jsr:@bates-solutions/clover`   | [GitHub](https://github.com/Bates-Solutions/clover)   |

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
