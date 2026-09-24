# Errors and Retries

Every service method throws a subclass of `SquareError`. Each one has a `code` (`SquareErrorCode`) and, when Square sent an HTTP response, a `statusCode`.

| Class                   | When                                                                                  | `statusCode`       |
| ----------------------- | ------------------------------------------------------------------------------------- | ------------------ |
| `SquareValidationError` | Input rejected before any request is sent; `field` names the offending option          | `400`              |
| `SquareAuthError`       | Square returned 401 (invalid, expired or revoked token)                               | `401`              |
| `SquarePaymentError`    | Card or payment-method failure (`CARD_DECLINED`, `VERIFY_CVV_FAILURE`, …)                    | `400`              |
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

- `SquareNetworkError`: a network failure or timeout
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

**Reuse the idempotency key when retrying a mutating call.** After a network failure or timeout you can't tell whether Square already processed the request. Mutating methods generate a new key on every call unless you pass `idempotencyKey`, so a retry without your own key can create a second payment, order or refund. Square deduplicates requests that share a key.

The Square SDK already retries 408, 429 and 5xx responses (twice, with backoff) before the wrapper sees them, so those errors have usually been retried already. It does not retry network failures or timeouts.
