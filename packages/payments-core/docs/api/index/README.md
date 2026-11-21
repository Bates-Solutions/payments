[**@bates-solutions/payments-core API Reference v0.1.0**](../README.md)

***

[@bates-solutions/payments-core API Reference](../README.md) / index

# index

Edge-safe primitives shared by `@bates-solutions/squareup`,
`@bates-solutions/stripe` and `@bates-solutions/clover`. Everything here runs
on Node 22+, Deno, Bun and Workers: no `node:*` imports, `Buffer` or
`process`. Each area is also its own entry point (`./crypto`, `./currency`,
`./errors`).

## Classes

- [PaymentsError](classes/PaymentsError.md)

## Interfaces

- [TimestampedSignatureHeader](interfaces/TimestampedSignatureHeader.md)
- [VerifyTimestampedHmacOptions](interfaces/VerifyTimestampedHmacOptions.md)

## Type Aliases

- [MinorUnitExponent](type-aliases/MinorUnitExponent.md)
- [TimestampedHmacFailure](type-aliases/TimestampedHmacFailure.md)
- [TimestampedHmacResult](type-aliases/TimestampedHmacResult.md)

## Functions

- [createIdempotencyKey](functions/createIdempotencyKey.md)
- [fromBase64](functions/fromBase64.md)
- [hmacSha256](functions/hmacSha256.md)
- [minorUnitExponent](functions/minorUnitExponent.md)
- [parseTimestampedSignatureHeader](functions/parseTimestampedSignatureHeader.md)
- [requireNonEmpty](functions/requireNonEmpty.md)
- [timingSafeEqual](functions/timingSafeEqual.md)
- [toBase64](functions/toBase64.md)
- [toHex](functions/toHex.md)
- [verifyTimestampedHmac](functions/verifyTimestampedHmac.md)
