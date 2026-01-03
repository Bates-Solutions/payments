# @bates/squareup

> TypeScript wrapper for Square API with React hooks & Angular services

[![npm version](https://img.shields.io/npm/v/@bates/squareup.svg)](https://npmjs.com/package/@bates/squareup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)

## Features

- **Simplified APIs** - Less boilerplate, more productivity
- **React Integration** - Hooks and components for payments
- **Angular Integration** - Services with RxJS Observables
- **Server Utilities** - Webhook verification and middleware
- **Type-Safe** - Full TypeScript support with strict types
- **Fluent Builders** - Chainable order and payment construction

## Installation

```bash
npm install @bates/squareup square
```

### Peer Dependencies

```bash
# For React integration
npm install react

# For Angular integration
npm install @angular/core @angular/common rxjs
```

## Quick Start

### Core (Node.js/Backend)

```typescript
import { createSquareClient } from '@bates/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
});

// Create a payment
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000, // $10.00 in cents
  currency: 'USD',
});

// Build an order with fluent API
const order = await square.orders
  .builder()
  .addItem({ name: 'Latte', amount: 450 })
  .addItem({ catalogId: 'ITEM_123', quantity: 2 })
  .withTip(100)
  .build();
```

### React

```tsx
import { SquareProvider, useSquarePayment, useOrders } from '@bates/squareup/react';

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
  const { cardRef, tokenize, ready, error } = useSquarePayment();
  const { create: createOrder } = useOrders();

  const handlePay = async () => {
    const token = await tokenize();
    await createOrder({
      lineItems: [{ name: 'Coffee', amount: 500 }],
      paymentToken: token,
    });
  };

  return (
    <div>
      <div ref={cardRef} />
      <button onClick={handlePay} disabled={!ready}>
        Pay $5.00
      </button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
```

### Angular

```typescript
import { SquareModule } from '@bates/squareup/angular';

@NgModule({
  imports: [
    SquareModule.forRoot({
      applicationId: 'sq0idp-xxx',
      locationId: 'LXXX',
      environment: 'sandbox',
    })
  ]
})
export class AppModule {}

@Component({...})
export class CheckoutComponent {
  constructor(private square: SquarePaymentsService) {}

  pay$ = () => this.square.tokenize().pipe(
    switchMap(token => this.square.createPayment({
      sourceId: token,
      amount: 1000
    }))
  );
}
```

### Server (Webhooks)

```typescript
import { createNextWebhookHandler } from '@bates/squareup/server';

// Next.js App Router
export const POST = createNextWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
  handlers: {
    'payment.completed': async (event) => {
      console.log('Payment received:', event.data.id);
    },
    'order.fulfillment.updated': async (event) => {
      await notifyCustomer(event.data.object);
    },
  },
});
```

## API Reference

### Core Module

| Export | Description |
|--------|-------------|
| `createSquareClient` | Factory for creating Square API client |
| `PaymentsService` | Payment processing operations |
| `OrdersService` | Order management with fluent builder |
| `CustomersService` | Customer CRUD and search |
| `CatalogService` | Product catalog operations |
| `InventoryService` | Stock tracking and adjustments |
| `SubscriptionsService` | Recurring billing management |
| `InvoicesService` | Invoice generation and sending |
| `LoyaltyService` | Loyalty program management |

### React Module (`@bates/squareup/react`)

| Export | Description |
|--------|-------------|
| `SquareProvider` | Context provider for SDK initialization |
| `useSquare` | Access Square context |
| `useSquarePayment` | Card tokenization hook |
| `usePayments` | Payments API hook |
| `useOrders` | Orders API hook |
| `useCustomers` | Customers API hook |
| `useCatalog` | Catalog API hook |
| `CardInput` | Pre-built card input component |
| `PaymentButton` | Google Pay / Apple Pay button |

### Angular Module (`@bates/squareup/angular`)

| Export | Description |
|--------|-------------|
| `SquareModule` | NgModule with `forRoot()` configuration |
| `SquareSdkService` | SDK loading service |
| `SquarePaymentsService` | Payment operations |
| `SquareOrdersService` | Order operations |
| `SquareCustomersService` | Customer operations |
| `SquareCatalogService` | Catalog operations |
| `SquareCardDirective` | Card input directive |
| `PaymentButtonComponent` | Digital wallet component |

### Server Module (`@bates/squareup/server`)

| Export | Description |
|--------|-------------|
| `verifySignature` | HMAC-SHA256 signature verification |
| `createExpressWebhookHandler` | Express middleware |
| `createNextWebhookHandler` | Next.js App Router handler |
| `createNextPagesWebhookHandler` | Next.js Pages Router handler |
| `parseNextWebhook` | Manual webhook parsing |

## Money Utilities

```typescript
import { toCents, fromCents, formatMoney } from '@bates/squareup';

toCents(10.99);           // 1099
fromCents(1099);          // 10.99
formatMoney(1099, 'USD'); // '$10.99'
```

## Error Handling

```typescript
import {
  SquareApiError,
  SquareValidationError,
  SquareNetworkError,
  SquareAuthenticationError
} from '@bates/squareup';

try {
  await square.payments.create({ ... });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.log('Invalid input:', error.errors);
  } else if (error instanceof SquareAuthenticationError) {
    console.log('Check your access token');
  } else if (error instanceof SquareNetworkError) {
    console.log('Network issue, retry later');
  }
}
```

## Configuration

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `accessToken` | `string` | Yes | Square API access token |
| `environment` | `'sandbox' \| 'production'` | No | API environment (default: `'sandbox'`) |
| `applicationId` | `string` | React/Angular | Web Payments SDK application ID |
| `locationId` | `string` | React/Angular | Square location ID |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT
