# Processing Payments

This guide covers how to process payments using the Square API with `@bates-solutions/squareup`.

## Prerequisites

- Square account with API credentials
- `@bates-solutions/squareup` installed
- Access token from Square Developer Dashboard

## Setup

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox', // Use 'production' for live payments
  locationId: 'YOUR_LOCATION_ID',
});
```

## Creating a Payment

The simplest way to create a payment:

```typescript
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok', // Payment source token
  amount: 1000, // $10.00 in cents
});

console.log('Payment ID:', payment.id);
console.log('Status:', payment.status);
```

### Payment Options

```typescript
const payment = await square.payments.create({
  // Required
  sourceId: 'cnon:card-nonce-ok',
  amount: 2500, // $25.00

  // Optional
  currency: 'USD', // Default: USD
  customerId: 'CUST_123', // Associate with customer
  orderId: 'ORDER_456', // Associate with order
  referenceId: 'ext-ref-789', // Your external reference
  note: 'Payment for services', // Visible on receipt
  autocomplete: true, // Default: true (capture immediately)
});
```

### Two-Step Payments (Authorize then Capture)

For delayed capture scenarios:

```typescript
// Step 1: Authorize the payment
const authorized = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 5000,
  autocomplete: false, // Don't capture yet
});

console.log('Authorized:', authorized.id);
// authorized.status === 'APPROVED'

// Step 2: Complete (capture) when ready
const completed = await square.payments.complete(authorized.id!);
console.log('Captured:', completed.status);
// completed.status === 'COMPLETED'
```

## Getting Payment Details

```typescript
const payment = await square.payments.get('PAYMENT_ID');

console.log('Amount:', payment.amountMoney?.amount);
console.log('Status:', payment.status);
console.log('Created:', payment.createdAt);
```

## Listing Payments

```typescript
const payments = await square.payments.list({
  limit: 25,
  locationId: 'LOCATION_ID', // Optional, uses default if not set
});

for (const payment of payments) {
  console.log(`${payment.id}: ${payment.status}`);
}
```

## Canceling a Payment

Cancel a payment that hasn't been completed:

```typescript
const cancelled = await square.payments.cancel('PAYMENT_ID');
console.log('Cancelled:', cancelled.status);
// cancelled.status === 'CANCELED'
```

## Error Handling

The library provides typed errors for different failure scenarios:

```typescript
import {
  SquarePaymentError,
  SquareValidationError,
  SquareAuthError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  const payment = await square.payments.create({
    sourceId: 'invalid-token',
    amount: 1000,
  });
} catch (error) {
  if (error instanceof SquarePaymentError) {
    // Card was declined or payment failed
    console.error('Payment failed:', error.message);
    console.error('Error code:', error.code);
    // error.code might be: 'CARD_DECLINED', 'CARD_EXPIRED', 'INVALID_CARD', etc.
  } else if (error instanceof SquareValidationError) {
    // Invalid input
    console.error('Invalid input:', error.field, error.message);
  } else if (error instanceof SquareAuthError) {
    // Authentication issue
    console.error('Auth error:', error.message);
  } else if (error instanceof SquareApiError) {
    // Other API error
    console.error('API error:', error.statusCode, error.errors);
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `CARD_DECLINED` | Card was declined |
| `CARD_EXPIRED` | Card has expired |
| `INVALID_CARD` | Invalid card number |
| `VERIFY_CVV_FAILURE` | CVV verification failed |
| `VERIFY_AVS_FAILURE` | Address verification failed |
| `GENERIC_DECLINE` | Generic decline |
| `RATE_LIMITED` | Too many requests |

## Idempotency

All payment requests automatically generate an idempotency key, but you can provide your own:

```typescript
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000,
  idempotencyKey: 'order-123-payment-attempt-1',
});
```

Using idempotency keys prevents duplicate charges if a request is retried.

## Best Practices

1. **Always use HTTPS** - Payment tokens are sensitive
2. **Validate amounts** - Ensure amount > 0 before calling
3. **Handle errors gracefully** - Show user-friendly messages
4. **Use idempotency keys** - Prevent duplicate charges
5. **Store payment IDs** - Keep records for refunds/disputes
6. **Test in sandbox** - Use test cards before going live

## Test Cards (Sandbox)

| Card Number | Result |
|-------------|--------|
| 4111 1111 1111 1111 | Success |
| 5105 1051 0510 5100 | Generic decline |
| 4000 0000 0000 0002 | CVV failure |
| 4000 0000 0000 0069 | Expired card |

Use any future expiration date and any 3-digit CVV.

## Next Steps

- [Orders Guide](./orders.md) - Create orders with payments
- [Customers Guide](./customers.md) - Save cards on file
- [React Hooks](../react/hooks.md) - Frontend payment forms
