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

A thin, consistent wrapper over the official [`stripe`](https://www.npmjs.com/package/stripe) Node SDK. It gives you a small service-oriented client, a typed error hierarchy, money helpers, and framework-ready webhook handling — while staying out of the way when you need the raw SDK. Part of the same family as [`@bates-solutions/squareup`](https://www.npmjs.com/package/@bates-solutions/squareup), so if you know one, you know this.

## Features

- **Simplified APIs** – Less boilerplate over payments, subscriptions, hosted checkout, and billing
- **Type-Safe** – Full TypeScript support; wraps Stripe's own types
- **Typed Errors** – `parseStripeError` normalizes Stripe errors into a small class hierarchy
- **Edge-ready webhooks** – WebCrypto signature verification that runs on Node, **Deno**, Bun, and Workers, plus Express / Next.js / Lambda adapters
- **Version-stable subscriptions** – Normalized shape with `Date` period fields, absorbing Stripe's API churn
- **Escape Hatch** – `client.sdk` exposes the underlying Stripe instance for anything not wrapped

## Requirements

| Dependency | Version |
| ---------- | ------- |
| Stripe SDK | 17–18   |
| Node.js    | 22+     |
| TypeScript | 5.0+    |

## Installation

```bash
npm install @bates-solutions/stripe stripe
```

`stripe` is a peer dependency — install it alongside this package.

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
const sub = await client.subscriptions.retrieve('sub_123');
sub.status;             // 'active'
sub.priceId;            // 'price_123'
sub.currentPeriodEnd;   // Date

// Read your catalog from Stripe (products expanded)
const { data: prices } = await client.prices.list({ active: true, expandProduct: true });
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
`getChargeId`, `getCustomerId`, `getSubscriptionId`, and `resolveId` (collapses
an id-string-or-expanded-object reference). `fromUnixTime(seconds)` converts
Stripe's epoch-seconds timestamps to a `Date`.

## Available Services

| Service         | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `payments`      | Create and manage payments (PaymentIntents)                     |
| `customers`     | Customer management + search                                    |
| `refunds`       | Create and list refunds                                         |
| `checkout`      | Hosted Checkout Sessions (subscription & one-time)              |
| `billingPortal` | Customer billing portal sessions                                |
| `subscriptions` | Retrieve/list/cancel subscriptions, normalized with `Date`s     |
| `prices`        | List/retrieve prices (with product expansion)                   |
| `products`      | List/retrieve products                                          |

## Utilities

```typescript
import { toMinor, fromMinor, formatMoney } from '@bates-solutions/stripe';

toMinor(10.99);            // 1099
fromMinor(1099);           // 10.99
formatMoney(1099, 'usd');  // "$10.99"
```

## Documentation

- [Getting started](./docs/getting-started/installation.md)
- [Guides](./docs/guides/README.md)
- [API reference](./docs/api/README.md)

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](./LICENSE) for details.
