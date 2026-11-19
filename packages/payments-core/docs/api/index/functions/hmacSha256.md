[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / hmacSha256

# Function: hmacSha256()

> **hmacSha256**(`secret`, `payload`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [crypto/hmac.ts:22](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/hmac.ts#L22)

HMAC-SHA256 of `payload` under `secret`, computed with WebCrypto
(`globalThis.crypto.subtle`), so it runs on Node 22+, Deno, Bun and Workers
with no Node built-ins. Strings are encoded as UTF-8.

Returns the raw 32-byte digest; encode it with [toHex](toHex.md) or
[toBase64](toBase64.md) to compare against a provider's signature header.

## Parameters

### secret

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

### payload

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

## Example

```typescript
const digest = await hmacSha256(secret, `${timestamp}.${rawBody}`);
const expected = toHex(digest);
```
