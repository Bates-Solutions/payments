# Errors

Every service method catches what the Stripe SDK throws and rethrows it through `parseStripeError`, so you only ever handle this library's error classes:

| Class                   | When                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `StripeValidationError` | This library rejected your input before calling Stripe. Has `field`.                                 |
| `StripePaymentError`    | A card error. Has `declineCode` and `paymentIntentId`.                                               |
| `StripeAuthError`       | Bad or missing API key, or an unknown Connect client ID.                                             |
| `StripeApiError`        | Any other Stripe error. Has `type` (the error type Stripe sent, unchanged), `param` and `requestId`. |
| `StripeError`           | The base class; also used for non-Stripe failures (`code: 'UNKNOWN'`).                               |

All of them carry a normalized `code` and, for Stripe errors, the HTTP `statusCode`.

```typescript
import { StripeError, StripePaymentError } from '@bates-solutions/stripe';

try {
  await stripe.payments.create({ amount: 1000, paymentMethod: 'pm_card_visa', confirm: true });
} catch (error) {
  if (error instanceof StripePaymentError && error.declineCode === 'insufficient_funds') {
    return showMessage('Your card has insufficient funds.');
  }
  if (error instanceof StripeError && error.code === 'RATE_LIMITED') {
    return retryLater();
  }
  throw error;
}
```

## Code map

`parseStripeError` understands both `stripe-node` error instances and plain objects in Stripe's API error shape. Stripe's API `type` is not enough on its own: it is `invalid_request_error` for a bad API key and for rate limits too. So, like the SDK, the mapping goes by HTTP status first (the SDK's specific error classes encode it), then by type.

| Stripe error                                                         | Class                | `code`                                       |
| -------------------------------------------------------------------- | -------------------- | -------------------------------------------- |
| HTTP 402, `card_error`                                               | `StripePaymentError` | see card codes below                         |
| HTTP 401 (bad or missing API key)                                    | `StripeAuthError`    | `UNAUTHORIZED`                               |
| HTTP 403 (permission)                                                | `StripeApiError`     | `FORBIDDEN`                                  |
| HTTP 429, or 400 with `code: rate_limit`                             | `StripeApiError`     | `RATE_LIMITED`                               |
| `idempotency_error`                                                  | `StripeApiError`     | `IDEMPOTENCY_ERROR`                          |
| `invalid_request_error` 404                                          | `StripeApiError`     | `NOT_FOUND`                                  |
| `invalid_request_error` 409                                          | `StripeApiError`     | `CONFLICT`                                   |
| `invalid_request_error` (other)                                      | `StripeApiError`     | `BAD_REQUEST`                                |
| connection error (no response)                                       | `StripeApiError`     | `SERVICE_UNAVAILABLE` (status 503)           |
| `api_error` 503                                                      | `StripeApiError`     | `SERVICE_UNAVAILABLE`                        |
| `api_error` (other)                                                  | `StripeApiError`     | `INTERNAL_SERVER_ERROR`                      |
| Connect OAuth `invalid_client`                                       | `StripeAuthError`    | `UNAUTHORIZED`                               |
| Connect OAuth `invalid_grant`, `invalid_request`, `invalid_scope`, … | `StripeApiError`     | `BAD_REQUEST` (`type` holds the OAuth error) |

Card codes (`StripePaymentError.code`), from the card error's `code`:

| Stripe code                          | `code`                    |
| ------------------------------------ | ------------------------- |
| `card_declined`                      | `CARD_DECLINED`           |
| `insufficient_funds`                 | `INSUFFICIENT_FUNDS`      |
| `expired_card`                       | `EXPIRED_CARD`            |
| `incorrect_cvc`, `invalid_cvc`       | `INCORRECT_CVC`           |
| `incorrect_number`, `invalid_number` | `INCORRECT_NUMBER`        |
| `processing_error`                   | `PROCESSING_ERROR`        |
| `authentication_required`            | `AUTHENTICATION_REQUIRED` |
| anything else                        | `CARD_DECLINED`           |

A decline is always `CARD_DECLINED`, whatever its reason; the reason (`insufficient_funds`, `lost_card`, `generic_decline`, ...) is on `error.declineCode`.
