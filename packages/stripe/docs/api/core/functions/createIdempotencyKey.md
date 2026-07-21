[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / createIdempotencyKey

# Function: createIdempotencyKey()

> **createIdempotencyKey**(): `string`

Defined in: [core/utils.ts:104](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/utils.ts#L104)

Create a unique idempotency key for Stripe API requests.

Uses the WebCrypto `randomUUID`, so it runs on any modern runtime (Node 20+,
Deno, Bun, Cloudflare Workers) — not just Node.

## Returns

`string`

UUID string

## Example

```typescript
const key = createIdempotencyKey();
// "550e8400-e29b-41d4-a716-446655440000"
```
