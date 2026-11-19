[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / parseTimestampedSignatureHeader

# Function: parseTimestampedSignatureHeader()

> **parseTimestampedSignatureHeader**(`header`, `scheme?`): [`TimestampedSignatureHeader`](../interfaces/TimestampedSignatureHeader.md)

Defined in: [crypto/timestamped.ts:48](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L48)

Parse a `t=<timestamp>,v1=<signature>,v1=…` header, the format Stripe and
Clover use.

Parts are split on `,`, and each on its first `=` only; keys and values are
trimmed, and a part with an empty key or value is skipped. A later `t`
replaces an earlier one. The timestamp is read with `parseInt`, so
`t=0123` is 123.

## Parameters

### header

`string`

### scheme?

`string` = `'v1'`

## Returns

[`TimestampedSignatureHeader`](../interfaces/TimestampedSignatureHeader.md)
