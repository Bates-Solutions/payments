[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / VerifyTimestampedHmacOptions

# Interface: VerifyTimestampedHmacOptions

Defined in: [crypto/timestamped.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L14)

Options for [verifyTimestampedHmac](../functions/verifyTimestampedHmac.md).

## Properties

### now?

> `optional` **now?**: `number`

Defined in: [crypto/timestamped.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L25)

The current time in Unix seconds. Defaults to the system clock. A value
that isn't a finite number rejects every timestamp.

***

### scheme?

> `optional` **scheme?**: `string`

Defined in: [crypto/timestamped.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L27)

The header key the signatures are listed under. Defaults to `v1`.

***

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [crypto/timestamped.ts:20](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L20)

Maximum age (or skew into the future) of the timestamp, in seconds.
Defaults to 300. Zero or a negative number turns the check off; `NaN` (or
a non-number) rejects every timestamp rather than skipping the check.
