# Refunds

The `refunds` service wraps Clover's Ecommerce [refunds](https://docs.clover.com/dev/docs/ecommerce-refunding-payments) (`POST /v1/refunds`).

## Create a refund

Refund a charge in full, or pass an `amount` (cents) for a partial refund.

```typescript
// Full refund
const refund = await clover.refunds.create({ chargeId: 'CHG_123' });

// Partial refund with a reason
const partial = await clover.refunds.create({
  chargeId: 'CHG_123',
  amount: 250, // $2.50
  reason: 'requested_by_customer',
});
```

| Field            | Type     | Description                                    |
| ---------------- | -------- | ---------------------------------------------- |
| `chargeId`       | `string` | **Required.** The charge to refund.            |
| `amount`         | `number` | Cents. Omit for a full refund.                 |
| `reason`         | `string` | Reason for the refund.                         |
| `idempotencyKey` | `string` | Defaults to a generated UUID.                  |

A missing `chargeId` or non-positive `amount` throws a `CloverValidationError`.

> `/v1/refunds` does not support partial refunds for charges that include taxes or
> tips, or charges with more than one line item.

## Retrieve

```typescript
const refund = await clover.refunds.get('REF_123');
```
