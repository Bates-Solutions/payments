[**@bates-solutions/stripe API Reference v2.1.1**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / formatMoney

# Function: formatMoney()

> **formatMoney**(`minor`, `currency?`, `locale?`): `string`

Defined in: [stripe/src/core/utils.ts:192](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/utils.ts#L192)

Format money for display.

Converts with [fromMinor](fromMinor.md), then formats with `Intl.NumberFormat`, which
picks the display decimals for the currency (e.g. none for `jpy` and `isk`,
three for `kwd`).

## Parameters

### minor

`number`

Amount in the smallest currency unit

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code, any case (default: usd)

### locale?

`string` = `'en-US'`

Locale for formatting (default: en-US)

## Returns

`string`

Formatted currency string

## Throws

If `currency` is not a non-empty string

## Example

```typescript
formatMoney(1050) // "$10.50"
formatMoney(1000, 'jpy', 'ja-JP') // "￥1,000"
formatMoney(5120, 'kwd') // "KWD 5.120"
```
