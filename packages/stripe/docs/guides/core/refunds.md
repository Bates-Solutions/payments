# Refunds

The `refunds` service wraps Stripe [Refunds](https://docs.stripe.com/api/refunds).

## Create a refund

Provide either a `paymentIntentId` or a `chargeId`. Omit `amount` for a full refund.

```typescript
// Full refund of a payment
const refund = await stripe.refunds.create({
  paymentIntentId: 'pi_123',
});

// Partial refund with a reason
const partial = await stripe.refunds.create({
  paymentIntentId: 'pi_123',
  amount: 500, // $5.00
  reason: 'requested_by_customer',
});
```

Options:

| Field             | Type                                                        | Description                                   |
| ----------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `paymentIntentId` | `string`                                                   | PaymentIntent to refund.                      |
| `chargeId`        | `string`                                                   | Charge to refund.                             |
| `amount`          | `number`                                                   | Amount in the smallest unit. Omit for a full refund. |
| `reason`          | `'duplicate' \| 'fraudulent' \| 'requested_by_customer'`   | Reason for the refund.                        |
| `metadata`        | `Record<string, string>`                                   | Arbitrary key/value metadata.                 |
| `idempotencyKey`  | `string`                                                   | Defaults to a generated UUID.                 |

At least one of `paymentIntentId` or `chargeId` is required, or a `StripeValidationError` is thrown.

## Retrieve and list

```typescript
const refund = await stripe.refunds.get('re_123');

const { data } = await stripe.refunds.list({ paymentIntentId: 'pi_123' });
```
