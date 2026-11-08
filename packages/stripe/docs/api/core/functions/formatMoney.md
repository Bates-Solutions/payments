[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / formatMoney

# Function: formatMoney()

> **formatMoney**(`minor`, `currency?`, `locale?`): `string`

Defined in: [core/utils.ts:77](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/utils.ts#L77)

Format money for display.

## Parameters

### minor

`number`

Amount in the smallest currency unit

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code (default: usd)

### locale?

`string` = `'en-US'`

Locale for formatting (default: en-US)

## Returns

`string`

Formatted currency string

## Example

```typescript
formatMoney(1050) // "$10.50"
formatMoney(1000, 'jpy', 'ja-JP') // "￥1,000"
```
