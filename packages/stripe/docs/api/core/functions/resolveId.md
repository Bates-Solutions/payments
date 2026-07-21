[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / resolveId

# Function: resolveId()

> **resolveId**(`value`): `string` \| `undefined`

Defined in: [core/utils.ts:145](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/utils.ts#L145)

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
