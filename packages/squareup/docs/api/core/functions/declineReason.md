[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / declineReason

# Function: declineReason()

> **declineReason**(`error`): [`DeclineReason`](../interfaces/DeclineReason.md) \| `undefined`

Defined in: [squareup/src/core/errors.ts:427](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L427)

Classify a failed charge: Square's decline code and whether charging the
same card again later can succeed.

Returns `undefined` when `error` is not a card decline (not a
[SquarePaymentError](../classes/SquarePaymentError.md), and no `PAYMENT_METHOD_ERROR` entry on a
[SquareApiError](../classes/SquareApiError.md)), and for Square's `TEMPORARY_ERROR`, which is a
transient failure rather than a decline. Unknown codes are not retryable.

| Code | `retryable` |
| --- | --- |
| `INSUFFICIENT_FUNDS` | `true`, after a few days |
| `TRANSACTION_LIMIT` | `true`, later |
| `GENERIC_DECLINE`, `CVV_FAILURE`, `CARD_EXPIRED`, `INVALID_ACCOUNT`, ... | `false` |
| any other code | `false` |

This is about the card. Network failures, 5xx responses and Square's
`TEMPORARY_ERROR` are a separate question: see [isRetryableSquareError](isRetryableSquareError.md),
and retry those with the **same** idempotency key.

## Parameters

### error

`unknown`

## Returns

[`DeclineReason`](../interfaces/DeclineReason.md) \| `undefined`

## Example

```typescript
try {
  await square.payments.create({ sourceId: cardId, customerId, amount, idempotencyKey });
} catch (error) {
  const decline = declineReason(error);
  if (decline?.retryable) {
    await scheduleRetry(subscriptionId, { inDays: 3, reason: decline.code });
  } else if (decline) {
    await askForNewCard(customerId, decline.code);
  } else {
    throw error;
  }
}
```
