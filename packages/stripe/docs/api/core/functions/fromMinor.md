[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / fromMinor

# Function: fromMinor()

> **fromMinor**(`minor`, `currency?`): `number`

<<<<<<< HEAD
Defined in: [core/utils.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/utils.ts#L58)
=======
Defined in: [core/utils.ts:58](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/utils.ts#L58)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Convert an amount in the smallest currency unit to a major-unit amount.

## Parameters

### minor

`number`

Amount in the smallest currency unit

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code (default: usd)

## Returns

`number`

Major-unit amount

## Example

```typescript
fromMinor(1050) // 10.50
fromMinor(1000, 'jpy') // 1000
```
