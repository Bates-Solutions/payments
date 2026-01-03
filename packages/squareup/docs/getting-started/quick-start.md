# Quick Start

Get up and running with `@bates/squareup` in 5 minutes.

## Prerequisites

1. A Square developer account
2. Access token from the [Square Developer Dashboard](https://developer.squareup.com/apps)
3. Node.js 18+

## Backend Setup

### 1. Install the package

```bash
npm install @bates/squareup square
```

### 2. Create the client

```typescript
import { createSquareClient } from '@bates/squareup';

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

## React Setup

### 1. Wrap your app with SquareProvider

```tsx
import { SquareProvider } from '@bates/squareup/react';

function App() {
  return (
    <SquareProvider
      applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
      locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
      environment="sandbox"
    >
      <YourApp />
    </SquareProvider>
  );
}
```

### 2. Use payment hooks

```tsx
import { useSquarePayment } from '@bates/squareup/react';

function CheckoutForm() {
  const { cardRef, tokenize, ready, loading, error } = useSquarePayment();

  const handleSubmit = async () => {
    const token = await tokenize();
    // Send token to your backend
    await fetch('/api/pay', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div ref={cardRef} />
      <button disabled={!ready || loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

## Angular Setup

### 1. Import the module

```typescript
import { SquareModule } from '@bates/squareup/angular';

@NgModule({
  imports: [
    SquareModule.forRoot({
      applicationId: environment.squareAppId,
      locationId: environment.squareLocationId,
      environment: 'sandbox',
    })
  ]
})
export class AppModule {}
```

### 2. Inject the service

```typescript
import { SquarePaymentsService } from '@bates/squareup/angular';

@Component({...})
export class CheckoutComponent {
  constructor(private payments: SquarePaymentsService) {}

  pay() {
    this.payments.tokenize().pipe(
      switchMap(token => this.payments.createPayment({
        sourceId: token,
        amount: 1000
      }))
    ).subscribe({
      next: payment => console.log('Success:', payment),
      error: err => console.error('Failed:', err)
    });
  }
}
```

## Next Steps

- [Configuration Guide](./configuration.md)
- [Payments Guide](../guides/core/payments.md)
- [React Hooks Reference](../guides/react/hooks.md)
- [Angular Services Reference](../guides/angular/services.md)
