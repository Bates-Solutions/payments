[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / fromMinor

# Function: fromMinor()

> **fromMinor**(`minor`, `currency?`): `number`

Defined in: [core/utils.ts:58](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/utils.ts#L58)

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
