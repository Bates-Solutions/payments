# Processing Payments

This guide covers how to process payments using the Square API with `@bates-solutions/squareup`.

## Prerequisites

- Square account with API credentials
- `@bates-solutions/squareup` installed
- Access token from Square Developer Dashboard

## Setup

```typescript
import { createIdempotencyKey, createSquareClient } from '@bates-solutions/squareup';

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
  idempotencyKey: createIdempotencyKey(),
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
  idempotencyKey: createIdempotencyKey(), // see Idempotency below

  // Optional
  currency: 'USD', // Default: USD
  customerId: 'CUST_123', // Associate with customer
  orderId: 'ORDER_456', // Associate with order
  referenceId: 'ext-ref-789', // Your external reference
  note: 'Payment for services', // Visible on receipt
  autocomplete: true, // Default: true (capture immediately)
  buyerEmailAddress: 'buyer@example.com', // Receipt and risk checks
  statementDescriptionIdentifier: 'ORDER456', // Added to the name on the card statement
  customerDetails: { customerInitiated: true, sellerKeyedIn: false },
  verificationToken: undefined, // Legacy verifyBuyer() token; Square deprecated verifyBuyer()
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
  idempotencyKey: createIdempotencyKey(),
});

console.log('Authorized:', authorized.id);
// authorized.status === 'APPROVED'

// Step 2: Complete (capture) when ready
const completed = await square.payments.complete(authorized.id!);
console.log('Captured:', completed.status);
// completed.status === 'COMPLETED'
```

### Charging a Card on File

Store the card once with [`cards.create()`](./cards.md), then charge its ID.
For a charge the buyer did not start (a renewal, a usage bill), say so with
`customerDetails.customerInitiated: false`; card networks treat these
merchant-initiated charges differently.

```typescript
const payment = await square.payments.create({
  sourceId: card.id!, // ccof:...
  customerId: card.customerId!,
  amount: 1500,
  customerDetails: { customerInitiated: false, sellerKeyedIn: false },
  idempotencyKey: `renewal-${subscriptionId}-${period}`,
});
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
    idempotencyKey: createIdempotencyKey(),
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

See [Errors and Retries](./errors.md) for network failures, timeouts and safe retries.

### Declines: retry later, or ask for another card?

`SquarePaymentError.code` is normalized, so it is `UNKNOWN` for many Square
decline codes. `declineReason(error)` reads Square's own code and says whether
charging the same card again later can succeed:

```typescript
import { declineReason } from '@bates-solutions/squareup';

try {
  await square.payments.create({ sourceId: card.id!, customerId, amount, idempotencyKey });
} catch (error) {
  const decline = declineReason(error); // undefined when it is not a decline
  if (decline?.retryable) {
    // INSUFFICIENT_FUNDS: try again in a few days, with a new idempotency key
    await scheduleRetry({ inDays: 3, reason: decline.code });
  } else if (decline) {
    // GENERIC_DECLINE, CVV_FAILURE, CARD_EXPIRED, ...: the buyer must act
    await askForNewCard(customerId, decline.code);
  } else {
    throw error;
  }
}
```

| Code | `retryable` | What to do |
|------|-------------|------------|
| `INSUFFICIENT_FUNDS` | `true` | Retry after a few days |
| `TRANSACTION_LIMIT` | `true` | Retry later (or for less) |
| `TEMPORARY_ERROR` | `true` | Retry soon |
| `GENERIC_DECLINE`, `CARD_DECLINED_CALL_ISSUER` | `false` | Buyer contacts the issuer or uses another card |
| `CVV_FAILURE`, `ADDRESS_VERIFICATION_FAILURE`, `INVALID_POSTAL_CODE` | `false` | Buyer corrects the details |
| `CARD_EXPIRED`, `INVALID_ACCOUNT`, `INVALID_CARD`, `CARD_NOT_SUPPORTED` | `false` | Buyer uses another card |
| any other code | `false` | Treat as a hard decline |

Retrying a hard decline again and again can get the merchant flagged by the
card networks, which is why unknown codes are not retryable.

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

`idempotencyKey` is **required** on every money-moving call:
`payments.create`, `refunds.refundPayment`, `cards.create` and
`subscriptions.create`. Leaving it out is a type error, and a
`SquareValidationError` (`field: 'idempotencyKey'`) at runtime. There is no
random default: a fresh key on a retry after a timeout would charge twice.

Square processes a key once, so derive the key from what the payment is for,
or create one and store it before you call:

```typescript
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000,
  orderId: 'ORDER_123',
  idempotencyKey: 'order-123-payment', // same key on every retry of this payment
});
```

Reuse a key only to resend the identical request. A new attempt (for example
after a decline) needs a new key. Keys are at most 45 characters.

> **Upgrading:** before this release, `payments.create` and
> `subscriptions.create` made up a key when you left it out. Pass one now.

## Best Practices

1. **Always use HTTPS** - Payment tokens are sensitive
2. **Validate amounts** - Ensure amount > 0 before calling
3. **Handle errors gracefully** - Show user-friendly messages
4. **Keep idempotency keys** - Store the key with the order so a retry reuses it
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
- [Cards on File](./cards.md) - Save cards and charge them later
- [Refunds](./refunds.md) - Refund payments
- [Customers Guide](./customers.md) - Customer records
