# Errors and Retries

Every service method throws a subclass of `SquareError`, which extends `PaymentsError` from `@bates-solutions/payments-core` (also exported from this package). Each one has a `code` (`SquareErrorCode`) and, when Square sent an HTTP response, a `statusCode`.

| Class                   | When                                                                                  | `statusCode`       |
| ----------------------- | ------------------------------------------------------------------------------------- | ------------------ |
| `SquareValidationError` | Input rejected before any request is sent; `field` names the offending option          | `400`              |
| `SquareAuthError`       | Square returned 401 (invalid, expired or revoked token)                               | `401`              |
| `SquarePaymentError`    | Card or payment-method failure (`CARD_DECLINED`, `VERIFY_CVV_FAILURE`, …). `errors` has Square's raw entries; see [Declines](#declines) | `400`              |
| `SquareApiError`        | Any other Square error. `errors` has Square's full error list                          | HTTP status, or `200` for an `errors` body |
| `SquareNetworkError`    | No response arrived: connection failure (`NETWORK_ERROR`) or timeout (`TIMEOUT`)      | `undefined`        |

```typescript
import {
  SquareApiError,
  SquareAuthError,
  SquareNetworkError,
  SquareValidationError,
} from '@bates-solutions/squareup';

try {
  await square.orders.get(orderId);
} catch (error) {
  if (error instanceof SquareNetworkError) {
    // error.code is 'NETWORK_ERROR' or 'TIMEOUT'; error.cause is the SDK error
  } else if (error instanceof SquareAuthError) {
    // reconnect / refresh the token
  } else if (error instanceof SquareApiError) {
    console.error(error.statusCode, error.code, error.errors);
  } else if (error instanceof SquareValidationError) {
    console.error(error.field, error.message);
  }
  throw error;
}
```

## Retrying

`isRetryableSquareError(error)` returns `true` when retrying the call could succeed:

- `SquareNetworkError`: a network failure or timeout (`code` is `NETWORK_ERROR` or `TIMEOUT`)
- HTTP `408` (request timeout) or `429` (rate limited)
- HTTP `5xx` (Square server error)

It returns `false` for validation, auth, payment and other 4xx errors, and for a `200` response that carries `errors`. Retrying those won't help.

```typescript
import { createIdempotencyKey, isRetryableSquareError } from '@bates-solutions/squareup';

const idempotencyKey = createIdempotencyKey();

for (let attempt = 1; ; attempt++) {
  try {
    return await square.payments.create({ sourceId, amount: 1000, idempotencyKey });
  } catch (error) {
    if (attempt >= 3 || !isRetryableSquareError(error)) throw error;
    await new Promise((r) => setTimeout(r, 2 ** attempt * 250));
  }
}
```

**Reuse the idempotency key when retrying a mutating call.** After a network failure or timeout you can't tell whether Square already processed the request. Square deduplicates requests that share a key. Money-moving calls (`payments.create`, `refunds.refundPayment`, `cards.create`, `subscriptions.create`) require an `idempotencyKey` for this reason, and throw a `SquareValidationError` without one. Other mutating methods take an optional `idempotencyKey` and generate a new key on every call if you don't pass one, so a retry without your own key can create a second order.

`invoices.create` and `loyalty.redeemReward` each make two Square calls. Your key covers both: the second call uses a key derived from yours (`<key>:order`, `<key>:redeem`, or a SHA-256 hash if that would exceed 128 characters). A retry with the same key reuses the order or reward instead of creating another.

`orders.pay` and `invoices.publish` take the key in a trailing options argument, for example `orders.pay(orderId, paymentIds, { idempotencyKey })`.

The Square SDK already retries 408, 429 and 5xx responses (twice, with backoff) before the wrapper sees them, so those errors have usually been retried already. It does not retry network failures or timeouts.

## Declines

A declined card is a `SquarePaymentError`, which `isRetryableSquareError`
reports as not retryable: resending the same request gets the same answer.
Whether the card can be charged again *later* is a separate question, and
`declineReason(error)` answers it from Square's own decline code:

```typescript
import { declineReason } from '@bates-solutions/squareup';

const decline = declineReason(error);
// undefined: not a decline
// { code: 'INSUFFICIENT_FUNDS', retryable: true }: try again in a few days
// { code: 'GENERIC_DECLINE', retryable: false }: ask the buyer for another card
```

`INSUFFICIENT_FUNDS`, `TRANSACTION_LIMIT` and `TEMPORARY_ERROR` are
retryable; every other code, including codes this package does not know, is
not. A later attempt is a new payment, so give it a new idempotency key. See
the [payments guide](./payments.md#declines-retry-later-or-ask-for-another-card)
for the full table.
