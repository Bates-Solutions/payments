# Guides

Tutorials and examples for `@bates-solutions/clover`.

## Core

- [Payments (Charges)](./core/payments.md) — create, get, capture
- [Refunds](./core/refunds.md) — full and partial refunds
- [Customers](./core/customers.md) — Platform customer CRUD

## Server

- [Webhook Handling](./server/webhooks.md) — signature verification + handshake
- [Framework Middleware](./server/middleware.md) — edge, Express, and Lambda

## Quick Start

```bash
npm install @bates-solutions/clover
```

```typescript
import { createCloverClient } from '@bates-solutions/clover';

const clover = createCloverClient({
  apiToken: process.env.CLOVER_API_TOKEN!,
  merchantId: process.env.CLOVER_MERCHANT_ID,
});

const charge = await clover.payments.create({
  amount: 1000,
  source: 'clv_1TSTStok...',
});
```
