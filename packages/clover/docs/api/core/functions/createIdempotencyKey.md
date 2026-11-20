[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / createIdempotencyKey

# Function: createIdempotencyKey()

> **createIdempotencyKey**(): `string`

Defined in: [payments-core/dist/crypto/random.d.ts:13](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/crypto/random.d.ts#L13)

Create a random idempotency key: a version 4 UUID from WebCrypto's
`randomUUID`, so it runs on Node 22+, Deno, Bun and Workers.

## Returns

`string`

A UUID string

## Example

```typescript
const key = createIdempotencyKey();
// "550e8400-e29b-41d4-a716-446655440000"
```
