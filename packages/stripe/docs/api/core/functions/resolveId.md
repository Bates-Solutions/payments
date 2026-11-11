[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / resolveId

# Function: resolveId()

> **resolveId**(`value`): `string` \| `undefined`

Defined in: [core/utils.ts:340](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/utils.ts#L340)

Resolve a Stripe reference that may be either an ID string or an expanded
object, to its ID.

Stripe fields like `customer` / `subscription` / `product` are a bare ID
string unless expanded, in which case they are the full object. This
collapses both forms.

## Parameters

### value

`string` \| \{ `id?`: `string`; \} \| `null` \| `undefined`

## Returns

`string` \| `undefined`

## Example

```typescript
resolveId('cus_1');          // 'cus_1'
resolveId({ id: 'cus_1' });  // 'cus_1'
resolveId(null);             // undefined
```
