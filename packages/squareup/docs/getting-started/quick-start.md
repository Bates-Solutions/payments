# Quick Start

Get up and running with `@bates-solutions/squareup` in 5 minutes.

## Prerequisites

1. A Square developer account
2. Access token from the [Square Developer Dashboard](https://developer.squareup.com/apps)
3. Node.js 18+

## Setup

### 1. Install the package

```bash
npm install @bates-solutions/squareup square
```

### 2. Create the client

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox', // Use 'production' for live
});
```

### 3. Make your first payment

```typescript
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok', // Test card nonce
  amount: 1000, // $10.00 in cents
  currency: 'USD',
});

console.log('Payment ID:', payment.id);
console.log('Status:', payment.status);
```

## Working with Orders

```typescript
// Use the fluent builder
const order = await square.orders.create(
  square.orders
    .builder()
    .addItem({ name: 'Coffee', quantity: 2, amount: 450 })
    .addItem({ name: 'Muffin', quantity: 1, amount: 350 })
    .build()
);

console.log('Order ID:', order.id);
console.log('Total:', order.totalMoney);
```

## Webhook Setup (Express)

```typescript
import express from 'express';
import { createWebhookHandler, rawBodyMiddleware } from '@bates-solutions/squareup/server';

const app = express();

app.use('/webhooks/square', rawBodyMiddleware);
app.use(express.json());

const webhookHandler = createWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
});

app.post('/webhooks/square', (req, res) => {
  const event = webhookHandler.verifyAndParse(req);
  console.log('Received event:', event.type);
  res.sendStatus(200);
});
```

## Next Steps

- [Configuration Guide](./configuration.md)
- [Payments Guide](../guides/core/payments.md)
- [Webhooks Guide](../guides/server/webhooks.md)
