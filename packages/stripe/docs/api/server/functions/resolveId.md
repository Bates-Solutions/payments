[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / resolveId

# Function: resolveId()

> **resolveId**(`value`): `string` \| `undefined`

Defined in: [server/webhook.ts:349](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/server/webhook.ts#L349)

Resolve a Stripe reference that may be either an ID string or an expanded
object, to its ID.

Stripe fields like `customer` / `subscription` are a bare ID string unless
expanded, in which case they are the full object. This collapses both forms.

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
