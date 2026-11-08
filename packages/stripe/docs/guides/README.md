# Guides

Tutorials and examples for `@bates-solutions/stripe`.

## Core

Backend API integration guides:

- [Processing Payments](./core/payments.md) - Create, capture, and cancel payments
- [Managing Customers](./core/customers.md) - Customer CRUD and search
- [Refunds](./core/refunds.md) - Full and partial refunds
- [Checkout](./core/checkout.md) - Hosted Checkout Sessions (subscription & one-time)
- [Billing Portal](./core/billing-portal.md) - Customer self-service billing
- [Subscriptions](./core/subscriptions.md) - Recurring billing, version-stable shape
- [Prices & Products](./core/prices-and-products.md) - Reading the plan catalog from Stripe

## Server

Backend webhook handling:

- [Webhook Handling](./server/webhooks.md) - Signature verification and event handling
- [Framework Middleware](./server/middleware.md) - Express, Next.js, and Lambda integration

## Quick Start

### 1. Install

```bash
npm install @bates-solutions/stripe stripe
```

### 2. Backend Setup

```typescript
import { createStripeClient } from '@bates-solutions/stripe';

const stripe = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

// Create a payment
const payment = await stripe.payments.create({
  amount: 1000,
  currency: 'usd',
  paymentMethod: 'pm_card_visa',
  confirm: true,
});
```

### 3. Webhook Setup

```typescript
// Express
import { createExpressWebhookHandler } from '@bates-solutions/stripe/server';

app.post('/webhook', createExpressWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
}));
```
