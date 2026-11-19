[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / timingSafeEqual

# Function: timingSafeEqual()

> **timingSafeEqual**(`a`, `b`): `boolean`

Defined in: [crypto/timing-safe.ts:18](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timing-safe.ts#L18)

Constant-time equality of two byte sequences, or two strings compared as
their UTF-8 bytes. Pure JS, so it works where `node:crypto` is missing.

Returns `false` without comparing when the lengths differ or either side is
empty: an empty signature must never verify. For equal lengths, the time
taken depends only on the length, not on where the inputs differ.

## Parameters

### a

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

### b

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`boolean`

## Example

```typescript
if (!timingSafeEqual(signatureFromHeader, expectedSignature)) {
  return { valid: false, error: 'Invalid signature' };
}
```
