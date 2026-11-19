# Errors and idempotency keys

## `PaymentsError`

`SquareError`, `StripeError` and `CloverError` all extend `PaymentsError`, from `./errors`. Each provider package also re-exports it, so an app that uses two providers can handle both in one place:

```typescript
import { PaymentsError } from '@bates-solutions/payments-core/errors';

try {
  await charge(order);
} catch (error) {
  if (error instanceof PaymentsError) {
    // error.name is the provider class, e.g. 'StripePaymentError'.
    log.warn({ name: error.name, code: error.code, status: error.statusCode });
  }
  throw error;
}
```

It has three fields besides `message` and `name`:

- `code`: the provider's normalized error code. Its type is the provider's union (`SquareErrorCode`, `StripeErrorCode`, `CloverErrorCode`); on a plain `PaymentsError` it is a `string`.
- `statusCode`: the HTTP status, when the error came from a response.
- `details`: the raw error body or other context.

On V8 (Node, Deno, Bun, Workers) the stack trace starts where the error was thrown, not inside the error constructors. Other engines skip that step rather than fail.

To write a provider error class, extend it with your code union, and set `name`:

```typescript
type AcmeErrorCode = 'NOT_FOUND' | 'UNKNOWN';

export class AcmeError extends PaymentsError<AcmeErrorCode> {
  constructor(
    message: string,
    code: AcmeErrorCode = 'UNKNOWN',
    statusCode?: number,
    details?: unknown
  ) {
    super(message, code, statusCode, details);
    this.name = 'AcmeError';
  }
}
```

Don't redeclare `code`, `statusCode` or `details` in the subclass: with ES2022 class fields, a redeclared field is reset to `undefined` after `super()` returns.

## `requireNonEmpty`

Throws when a required string option is missing or empty, with the error your callback builds, and narrows the value to `string`:

```typescript
import { requireNonEmpty } from '@bates-solutions/payments-core/errors';

requireNonEmpty(
  options.clientId,
  'clientId',
  (message, field) => new AcmeValidationError(message, field)
);
// message is 'clientId is required'
```

It doesn't trim: `' '` passes.

## `createIdempotencyKey`

Returns a random version 4 UUID from WebCrypto's `randomUUID`, from `./crypto`. The provider packages use it for mutating calls when you don't pass your own `idempotencyKey`, and re-export it under the same name.
