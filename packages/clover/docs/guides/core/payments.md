# Payments (Charges)

The `payments` service wraps Clover's Ecommerce [charges](https://docs.clover.com/dev/docs/create-a-charge) (`POST /v1/charges`). Amounts are in cents; `source` is a Clover card token (`clv_…`).

## Create a charge

```typescript
const charge = await clover.payments.create({
  amount: 1000, // $10.00
  currency: 'usd',
  source: 'clv_1TSTStok...',
  description: 'Order #123',
  receiptEmail: 'buyer@example.com',
});
```

Options:

| Field                 | Type           | Description                                          |
| --------------------- | -------------- | ---------------------------------------------------- |
| `amount`              | `number`       | **Required.** Amount in cents.                       |
| `source`              | `string`       | **Required.** Card token (`clv_…`).                  |
| `currency`            | `CurrencyCode` | Defaults to `usd`.                                   |
| `capture`             | `boolean`      | `false` to authorize only. Default `true`.           |
| `description`         | `string`       | Description on the charge.                           |
| `receiptEmail`        | `string`       | Email to send the receipt to.                       |
| `externalReferenceId` | `string`       | Your invoice/PO reference.                          |
| `idempotencyKey`      | `string`       | Defaults to a generated UUID (`idempotency-key` header). |

A missing `source` or non-positive `amount` throws a `CloverValidationError`; a decline throws a `CloverPaymentError`.

## Authorize then capture

```typescript
const auth = await clover.payments.create({ amount: 1000, source: 'clv_…', capture: false });
// later:
await clover.payments.capture(auth.id!, { amount: 800 }); // capture $8.00 of the $10 auth
```

## Retrieve

```typescript
const charge = await clover.payments.get('CHG_123');
```
