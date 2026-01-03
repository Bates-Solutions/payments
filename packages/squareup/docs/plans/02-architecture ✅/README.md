# Architecture

## Package Configuration

```json
{
  "name": "@bates/squareup",
  "exports": {
    ".": "./dist/core/index.js",
    "./react": "./dist/react/index.js",
    "./angular": "./dist/angular/index.js",
    "./server": "./dist/server/index.js"
  },
  "peerDependencies": {
    "square": "^41.0.0",
    "react": "^18.0.0 || ^19.0.0",
    "@angular/core": "^17.0.0 || ^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "@angular/core": { "optional": true }
  }
}
```

---

## Directory Structure

```
src/
├── core/
│   ├── client.ts              # Main SquareClient wrapper
│   ├── builders/
│   │   ├── order.builder.ts   # Fluent order creation
│   │   ├── payment.builder.ts # Payment construction
│   │   └── customer.builder.ts
│   ├── services/
│   │   ├── payments.service.ts
│   │   ├── orders.service.ts
│   │   ├── customers.service.ts
│   │   ├── catalog.service.ts
│   │   ├── inventory.service.ts
│   │   ├── subscriptions.service.ts
│   │   └── invoices.service.ts
│   ├── errors.ts              # Typed error classes
│   ├── utils.ts               # Money helpers, ID generation
│   └── index.ts
│
├── react/
│   ├── SquareProvider.tsx     # Context provider
│   ├── hooks/
│   │   ├── useSquarePayment.ts    # Web Payments SDK integration
│   │   ├── usePayments.ts         # Payments API
│   │   ├── useOrders.ts
│   │   ├── useCustomers.ts
│   │   ├── useCatalog.ts
│   │   └── useSubscriptions.ts
│   ├── components/
│   │   ├── CardInput.tsx      # Pre-built card form
│   │   └── PaymentButton.tsx  # Apple/Google Pay buttons
│   └── index.ts
│
├── angular/
│   ├── square.module.ts       # NgModule
│   ├── services/
│   │   ├── square-payments.service.ts
│   │   ├── square-orders.service.ts
│   │   └── ...
│   ├── directives/
│   │   └── square-card.directive.ts
│   └── index.ts
│
├── server/
│   ├── webhook.ts             # Signature verification
│   ├── middleware/
│   │   ├── express.ts
│   │   ├── fastify.ts
│   │   └── nextjs.ts
│   └── index.ts
│
└── types/
    ├── config.ts
    ├── money.ts
    └── index.ts
```

---

## Implementation Phases

### Phase 1: Core Foundation ✅
- [x] Project setup (TypeScript, build tooling, ESLint)
- [x] Core client wrapper around `square` SDK
- [x] Error handling with typed exceptions
- [x] Money utility helpers (`toCents()`, `fromCents()`, `formatMoney()`)
- [x] Payments service with simplified API
- [x] Orders service with fluent builder

### Phase 2: Extended Core APIs ✅
- [x] Customers service
- [x] Catalog service
- [x] Inventory service
- [x] Subscriptions service
- [x] Invoices service
- [x] Loyalty service

### Phase 3: React Integration ✅
- [x] SquareProvider context
- [x] useSquarePayment hook (Web Payments SDK wrapper)
- [x] usePayments, useOrders, useCustomers hooks
- [x] Pre-built CardInput component
- [x] Digital wallet payment buttons

### Phase 4: Angular Integration ✅
- [x] SquareModule with forRoot configuration
- [x] Injectable services with RxJS Observables
- [x] Card input directive
- [x] Async pipe-friendly APIs

### Phase 5: Server Utilities ✅
- [x] Webhook signature verification
- [x] Express middleware
- [x] Next.js API route handlers
- [x] Event type definitions and handlers

---

## API Coverage Plan

| Priority | API | Use Case |
|----------|-----|----------|
| **P0** | Payments | Core payment processing |
| **P0** | Orders | Order management |
| **P0** | Customers | Customer profiles |
| **P0** | Catalog | Product management |
| **P1** | Inventory | Stock tracking |
| **P1** | Subscriptions | Recurring billing |
| **P1** | Invoices | Invoice generation |
| **P1** | Loyalty | Rewards programs |
| **P2** | Bookings | Appointment scheduling |
| **P2** | Team/Labor | Staff management |
| **P2** | Gift Cards | Gift card operations |
| **P2** | Locations | Multi-location support |

---

## Example Usage

### Core (Node.js/Backend)

```typescript
import { createSquareClient } from '@bates/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: 'sandbox',
});

// Simple payment
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000, // $10.00 in cents
  currency: 'USD',
});

// Fluent order builder
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
    const order = await createOrder({
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
import { createWebhookHandler } from '@bates/squareup/server';

// Next.js App Router
export const POST = createWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
  handlers: {
    'payment.completed': async (event) => {
      console.log('Payment received:', event.data.object.payment.id);
    },
    'order.fulfillment.updated': async (event) => {
      await notifyCustomer(event.data.object.order);
    },
  },
});
```
