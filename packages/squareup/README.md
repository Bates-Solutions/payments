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

Stop wrestling with Square's low-level APIs. **squareup** gives you a simplified client API and fluent builders that make payment integration straightforward. Process payments, manage orders, handle webhooks—all with full TypeScript support and zero boilerplate.

## Features

- **Simplified APIs** - Less boilerplate, more productivity
- **Type-Safe** - Full TypeScript support with strict types
- **Fluent Builders** - Chainable order and payment construction
- **Webhook Support** - Signature verification and middleware for Express/Next.js
- **Service Classes** - Payments, Orders, Customers, Catalog, Inventory, Subscriptions, Invoices, Loyalty

## Requirements

| Dependency | Version |
| ---------- | ------- |
| Square SDK | ^43.0.0 |
| Node.js    | 22+     |
| TypeScript | 5.0+    |

## Installation

```bash
npm install @bates-solutions/squareup square
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
});

// Create an order with the fluent builder
const order = await client.orders.create(
  client.orders
    .builder()
    .addItem({ name: 'Coffee', quantity: 2, amount: 450 })
    .addItem({ name: 'Muffin', quantity: 1, amount: 350 })
    .build()
);

// Manage customers
const customer = await client.customers.create({
  givenName: 'John',
  familyName: 'Doe',
  emailAddress: 'john@example.com',
});
```

### Webhook Handling (Express)

```typescript
import express from 'express';
import { createWebhookHandler, rawBodyMiddleware } from '@bates-solutions/squareup/server';

const app = express();

// Use raw body middleware before JSON parsing for webhook routes
app.use('/webhooks/square', rawBodyMiddleware);
app.use(express.json());

const webhookHandler = createWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
});

app.post('/webhooks/square', (req, res) => {
  const event = webhookHandler.verifyAndParse(req);

  switch (event.type) {
    case 'payment.completed':
      console.log('Payment completed:', event.data);
      break;
    case 'order.created':
      console.log('Order created:', event.data);
      break;
  }

  res.sendStatus(200);
});
```

### Webhook Handling (Next.js)

```typescript
// app/api/webhooks/square/route.ts
import { createWebhookHandler } from '@bates-solutions/squareup/server';

const webhookHandler = createWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-square-hmacsha256-signature')!;

  const event = webhookHandler.verifyAndParse(body, signature);

  // Handle the event
  console.log('Received event:', event.type);

  return new Response('OK', { status: 200 });
}
```

## Available Services

| Service         | Description                          |
| --------------- | ------------------------------------ |
| `payments`      | Process and manage payments          |
| `orders`        | Create and manage orders             |
| `customers`     | Customer management                  |
| `catalog`       | Product catalog operations           |
| `inventory`     | Inventory tracking                   |
| `subscriptions` | Subscription management              |
| `invoices`      | Invoice operations                   |
| `loyalty`       | Loyalty program management           |

## Utilities

```typescript
import { toCents, fromCents, formatMoney } from '@bates-solutions/squareup';

toCents(10.99);           // 1099
fromCents(1099);          // 10.99
formatMoney(1099, 'USD'); // "$10.99"
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](./LICENSE) for details.
