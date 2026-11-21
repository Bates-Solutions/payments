# payments-core guides

`@bates-solutions/payments-core` holds the edge-safe primitives the provider packages share. Most apps use it indirectly, through `@bates-solutions/squareup`, `@bates-solutions/stripe` or `@bates-solutions/clover`.

- [Verifying a webhook signature](./webhook-signatures.md): HMAC-SHA256, encoding and constant-time compare.
- [Currency rules](./currency.md): `minorUnitExponent`, the decimal places of each currency's minor unit.
- [Errors and idempotency keys](./errors.md): the `PaymentsError` base class, `requireNonEmpty` and `createIdempotencyKey`.

The generated API reference is in [`../api`](../api/README.md).
