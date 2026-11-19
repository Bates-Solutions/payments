[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / parseTimestampedSignatureHeader

# Function: parseTimestampedSignatureHeader()

> **parseTimestampedSignatureHeader**(`header`, `scheme?`): [`TimestampedSignatureHeader`](../interfaces/TimestampedSignatureHeader.md)

Defined in: [crypto/timestamped.ts:61](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L61)

Parse a `t=<timestamp>,v1=<signature>,v1=…` header, the format Stripe and
Clover use.

These are the rules Stripe's and Clover's packages used before core, kept
exactly:

- Parts are split on `,`, and each part with `split('=', 2)`: the key is the
  text before the first `=`, the value the text up to the next `=`, and
  anything after a second `=` is dropped (`v1=abc=junk` reads as `abc`).
- A part whose key or value is empty is skipped. That check comes before
  trimming, so `v1= ` adds an empty signature (which never matches) and
  `t= ` resets the timestamp to `null`.
- Keys and values are then trimmed. A later `t` replaces an earlier one.
- The timestamp is read with `parseInt`, so `t=0123` is 123 and `t=12abc` is 12.

## Parameters

### header

`string`

### scheme?

`string` = `'v1'`

## Returns

[`TimestampedSignatureHeader`](../interfaces/TimestampedSignatureHeader.md)
