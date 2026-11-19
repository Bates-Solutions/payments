[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / toBase64

# Function: toBase64()

> **toBase64**(`bytes`): `string`

Defined in: [crypto/encoding.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/encoding.ts#L27)

Bytes as standard base64 (RFC 4648, `+` and `/`, with `=` padding), the
encoding Square uses for its webhook signatures.

## Parameters

### bytes

`ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`string`

## Example

```typescript
toBase64(new TextEncoder().encode('hi')); // 'aGk='
```
