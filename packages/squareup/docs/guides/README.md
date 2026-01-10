# Guides

Comprehensive tutorials and examples for `@bates-solutions/squareup`.

## Core

Backend API integration guides:

- [Processing Payments](./core/payments.md) - Create, capture, and cancel payments
- [Managing Orders](./core/orders.md) - Order builder and order lifecycle
- [Managing Customers](./core/customers.md) - Customer CRUD and search
- [Managing the Catalog](./core/catalog.md) - Items, categories, and variations

## React

React integration guides:

- [React Setup](./react/setup.md) - SquareProvider configuration
- [React Hooks](./react/hooks.md) - All available hooks
- [React Components](./react/components.md) - CardInput and PaymentButton

## Angular

Angular integration guides:

- [Angular Setup](./angular/setup.md) - SquareModule configuration
- [Angular Services](./angular/services.md) - Injectable services and RxJS patterns

## Server

Backend webhook handling:

- [Webhook Handling](./server/webhooks.md) - Signature verification and event handling
- [Framework Middleware](./server/middleware.md) - Express and Next.js integration

## Quick Start

### 1. Install

```bash
npm install @bates-solutions/squareup
```

### 2. Backend Setup

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
  locationId: 'YOUR_LOCATION_ID',
});

// Create a payment
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000,
});
```

### 3. React Setup

```tsx
import { SquareProvider, useSquarePayment, usePayments } from '@bates-solutions/squareup/react';

function App() {
  return (
    <SquareProvider
      applicationId="sq0idp-xxx"
      locationId="LXXX"
      environment="sandbox"
    >
      <Checkout />
    </SquareProvider>
  );
}

function Checkout() {
  const { cardRef, tokenize, ready } = useSquarePayment();
  const { create } = usePayments();

  const handlePay = async () => {
    const token = await tokenize();
    await create({ sourceId: token, amount: 1000 });
  };

  return (
    <div>
      <div ref={cardRef} />
      <button onClick={handlePay} disabled={!ready}>Pay</button>
    </div>
  );
}
```

### 4. Angular Setup

```typescript
import { SquareModule } from '@bates-solutions/squareup/angular';

@NgModule({
  imports: [
    SquareModule.forRoot({
      applicationId: 'sq0idp-xxx',
      locationId: 'LXXX',
      environment: 'sandbox',
    }),
  ],
})
export class AppModule {}
```

### 5. Webhook Setup

```typescript
// Express
import { createExpressWebhookHandler } from '@bates-solutions/squareup/server';

app.post('/webhook', createExpressWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
  handlers: {
    'payment.created': async (event) => {
      console.log('Payment:', event.data.id);
    },
  },
}));
```

## API Reference

For detailed API documentation, see [API Reference](../api-reference.md).
