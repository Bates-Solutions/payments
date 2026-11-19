[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / TimestampedSignatureHeader

# Interface: TimestampedSignatureHeader

Defined in: [crypto/timestamped.ts:6](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L6)

The parts of a `t=<timestamp>,<scheme>=<signature>,…` signature header.

## Properties

### signatures

> **signatures**: `string`[]

Defined in: [crypto/timestamped.ts:10](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L10)

Every signature listed under the scheme, in header order.

***

### timestamp

> **timestamp**: `number` \| `null`

Defined in: [crypto/timestamped.ts:8](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L8)

The `t` value in Unix seconds, or `null` when it is missing or not a number.
