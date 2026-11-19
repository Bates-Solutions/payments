[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / toHex

# Function: toHex()

> **toHex**(`bytes`): `string`

Defined in: [crypto/encoding.ts:9](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/encoding.ts#L9)

Bytes as lowercase hex, two characters per byte.

## Parameters

### bytes

`ArrayBuffer` \| `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`string`

## Example

```typescript
toHex(new Uint8Array([0, 15, 255])); // '000fff'
```
