[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / VerifyTimestampedHmacOptions

# Interface: VerifyTimestampedHmacOptions

Defined in: [crypto/timestamped.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L14)

Options for [verifyTimestampedHmac](../functions/verifyTimestampedHmac.md).

## Properties

### now?

> `optional` **now?**: `number`

Defined in: [crypto/timestamped.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L28)

The current time in Unix seconds. Defaults to the system clock. Coerced
with `Number()` like the tolerance; a value that doesn't coerce to a finite
number rejects every timestamp.

***

### scheme?

> `optional` **scheme?**: `string`

Defined in: [crypto/timestamped.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L30)

The header key the signatures are listed under. Defaults to `v1`.

***

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [crypto/timestamped.ts:22](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L22)

Maximum age (or skew into the future) of the timestamp, in seconds.
Defaults to 300. Zero or a negative number turns the check off. A value
that isn't a number is coerced with `Number()`, as the providers' old checks
did; one that coerces to `NaN` rejects every timestamp rather than skipping
the check.
