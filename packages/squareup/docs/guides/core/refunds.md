# Refunds

`square.refunds` refunds all or part of a Square payment and reads refunds
back.

## Refunding a Payment

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
  defaultCurrency: 'USD',
});

const refund = await square.refunds.refundPayment({
  // Required
  paymentId: 'PAYMENT_123',
  amountMoney: { amount: 500 }, // $5.00 in cents; currency defaults to the client's
  idempotencyKey: 'refund-order-123-damaged',

  // Optional
  reason: 'Damaged item',
});

console.log(refund.id, refund.status); // 'PENDING' at first
```

- `amountMoney.amount` is in the smallest currency unit and must be greater
  than 0. It can be at most the payment total minus what is already refunded.
  `amountMoney.currency` must match the payment's currency.
- `idempotencyKey` is required: Square refunds once per key, so a retry with
  the same key cannot refund twice. Derive it from what the refund is for (an
  order and a reason, a support ticket), or store the key before the call. At
  most 45 characters.
- A missing or empty `paymentId` or `idempotencyKey`, or a non-positive amount,
  throws a `SquareValidationError` naming the field.

A refund starts `PENDING`. Square sends a `refund.updated` webhook when it
becomes `COMPLETED`, `REJECTED` or `FAILED`; see
[Webhook Handling](../server/webhooks.md#refund-events).

## Getting a Refund

```typescript
const refund = await square.refunds.get('REFUND_123');
```

## Listing Refunds

`list` returns one page and the cursor of the next one (`undefined` on the last
page). Without filters it returns the last year of refunds, newest first, at
every location.

```typescript
const page = await square.refunds.list({
  beginTime: '2026-11-01T00:00:00Z', // created at or after (RFC 3339)
  endTime: '2026-12-01T00:00:00Z', //   created before
  sortOrder: 'DESC', // Default: DESC
  locationId: 'LOCATION_ID',
  status: 'COMPLETED',
  sourceType: 'CARD',
  limit: 50, // Square caps a page at 100
});

const next = await square.refunds.list({ status: 'COMPLETED', cursor: page.cursor });
```

## Next Steps

- [Processing Payments](./payments.md) - Payments and idempotency keys
- [Errors and Retries](./errors.md) - Retrying safely
