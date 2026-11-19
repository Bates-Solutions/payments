[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / VerifyTimestampedHmacOptions

# Interface: VerifyTimestampedHmacOptions

Defined in: [crypto/timestamped.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L14)

Options for [verifyTimestampedHmac](../functions/verifyTimestampedHmac.md).

## Properties

### now?

> `optional` **now?**: `number`

Defined in: [crypto/timestamped.ts:21](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L21)

The current time in Unix seconds. Defaults to the system clock.

***

### scheme?

> `optional` **scheme?**: `string`

Defined in: [crypto/timestamped.ts:23](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L23)

The header key the signatures are listed under. Defaults to `v1`.

***

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [crypto/timestamped.ts:19](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L19)

Maximum age (or skew into the future) of the timestamp, in seconds.
Defaults to 300. Zero or a negative number turns the check off.
