<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="React" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Angular-17+-DD0031?logo=angular&logoColor=white&style=for-the-badge" alt="Angular" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Square-Payments-0066CC?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNjZDQyIvPgo8cGF0aCBkPSJNOC41IDEySDE1LjVWMTMuNUgxMC41VjE1SDE1LjVWMTYuNUgxMC41VjE4SDE1LjVWMTlIMFYxMkg4LjVWMTJIMFYxMkg4LjVWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K&style=for-the-badge" alt="Square" height="28">
</p>

<h1 align="center">@bates-solutions/squareup</h1>

<p align="center">
  <strong>The modern TypeScript SDK for Square payments</strong><br>
  Build payment experiences in React and Angular with type-safe APIs, fluent builders, and framework-native integrations.
</p>

<p align="center">
  <a href="https://npmjs.com/package/@bates-solutions/squareup"><img src="https://img.shields.io/npm/v/@bates-solutions/squareup.svg" alt="npm version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript"></a>
  <br>
  <img src="https://img.shields.io/badge/tests-329%20passed-brightgreen.svg" alt="Tests">
  <img src="https://img.shields.io/badge/coverage-99.84%25-brightgreen.svg" alt="Coverage">
  <img src="https://img.shields.io/badge/React-110%20tests-blue.svg" alt="React Tests">
  <img src="https://img.shields.io/badge/Angular-133%20tests-red.svg" alt="Angular Tests">
</p>

---

Stop wrestling with Square's low-level APIs. **squareup** gives you React hooks, Angular services, and a fluent builder API that makes payment integration feel native to your framework. Tokenize cards, process payments, manage orders, and handle webhooks—all with full TypeScript support and zero boilerplate.

## Features

- **Simplified APIs** - Less boilerplate, more productivity
- **React Integration** - Hooks and components for payments
- **Angular Integration** - Services with RxJS Observables
- **Server Utilities** - Webhook verification and middleware
- **Type-Safe** - Full TypeScript support with strict types
- **Fluent Builders** - Chainable order and payment construction

## 🧪 Testing & Quality

**329 comprehensive tests** with **99.84% code coverage** ensure reliability and maintainability:

- **React Tests (110)**: Complete coverage of hooks, components, and integrations
- **Angular Tests (133)**: Full service testing with RxJS observables
- **Core Tests (86)**: API clients, builders, and utilities
- **Coverage Breakdown**:
  - Statements: **99.84%**
  - Branches: **95.99%**
  - Functions: **100%**
  - Lines: **99.84%**

Run tests with:

```bash
npm test              # All tests
npm run test:react    # React tests only
npm run test:angular  # Angular tests only
npm run test:coverage # With coverage report
```

## Installation

```bash
npm install @bates-solutions/squareup square
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
import { createSquareClient } from '@bates-solutions/squareup';

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
import { SquareProvider, useSquarePayment, useOrders } from '@bates-solutions/squareup/react';

function App() {
  return (
    <SquareProvider applicationId="sq0idp-xxx" locationId="LXXX" environment="sandbox">
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
import { SquareModule } from '@bates-solutions/squareup/angular';

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
import { createNextWebhookHandler } from '@bates-solutions/squareup/server';

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

| Export                 | Description                            |
| ---------------------- | -------------------------------------- |
| `createSquareClient`   | Factory for creating Square API client |
| `PaymentsService`      | Payment processing operations          |
| `OrdersService`        | Order management with fluent builder   |
| `CustomersService`     | Customer CRUD and search               |
| `CatalogService`       | Product catalog operations             |
| `InventoryService`     | Stock tracking and adjustments         |
| `SubscriptionsService` | Recurring billing management           |
| `InvoicesService`      | Invoice generation and sending         |
| `LoyaltyService`       | Loyalty program management             |

### React Module (`@bates-solutions/squareup/react`)

| Export             | Description                             |
| ------------------ | --------------------------------------- |
| `SquareProvider`   | Context provider for SDK initialization |
| `useSquare`        | Access Square context                   |
| `useSquarePayment` | Card tokenization hook                  |
| `usePayments`      | Payments API hook                       |
| `useOrders`        | Orders API hook                         |
| `useCustomers`     | Customers API hook                      |
| `useCatalog`       | Catalog API hook                        |
| `CardInput`        | Pre-built card input component          |
| `PaymentButton`    | Google Pay / Apple Pay button           |

### Angular Module (`@bates-solutions/squareup/angular`)

| Export                   | Description                             |
| ------------------------ | --------------------------------------- |
| `SquareModule`           | NgModule with `forRoot()` configuration |
| `SquareSdkService`       | SDK loading service                     |
| `SquarePaymentsService`  | Payment operations                      |
| `SquareOrdersService`    | Order operations                        |
| `SquareCustomersService` | Customer operations                     |
| `SquareCatalogService`   | Catalog operations                      |
| `SquareCardDirective`    | Card input directive                    |
| `PaymentButtonComponent` | Digital wallet component                |

### Server Module (`@bates-solutions/squareup/server`)

| Export                          | Description                        |
| ------------------------------- | ---------------------------------- |
| `verifySignature`               | HMAC-SHA256 signature verification |
| `createExpressWebhookHandler`   | Express middleware                 |
| `createNextWebhookHandler`      | Next.js App Router handler         |
| `createNextPagesWebhookHandler` | Next.js Pages Router handler       |
| `parseNextWebhook`              | Manual webhook parsing             |

## Money Utilities

```typescript
import { toCents, fromCents, formatMoney } from '@bates-solutions/squareup';

toCents(10.99); // 1099
fromCents(1099); // 10.99
formatMoney(1099, 'USD'); // '$10.99'
```

## Error Handling

```typescript
import {
  SquareApiError,
  SquareValidationError,
  SquareNetworkError,
  SquareAuthenticationError
} from '@bates-solutions/squareup';

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

| Option          | Type                        | Required      | Description                            |
| --------------- | --------------------------- | ------------- | -------------------------------------- |
| `accessToken`   | `string`                    | Yes           | Square API access token                |
| `environment`   | `'sandbox' \| 'production'` | No            | API environment (default: `'sandbox'`) |
| `applicationId` | `string`                    | React/Angular | Web Payments SDK application ID        |
| `locationId`    | `string`                    | React/Angular | Square location ID                     |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT
