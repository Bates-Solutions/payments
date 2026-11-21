[**@bates-solutions/squareup API Reference v3.0.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / formatMoney

# Function: formatMoney()

> **formatMoney**(`cents`, `currency?`, `locale?`): `string`

Defined in: [squareup/src/core/utils.ts:95](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/utils.ts#L95)

Format money for display

## Parameters

### cents

`number` \| `bigint`

Amount in smallest currency unit

### currency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"` = `'USD'`

Currency code (default: USD)

### locale?

`string` = `'en-US'`

Locale for formatting (default: en-US)

## Returns

`string`

Formatted currency string

## Throws

When `currency` is not a string, or is empty or only whitespace

## Example

```typescript
formatMoney(1050n) // "$10.50"
formatMoney(1050n, 'USD', 'en-US') // "$10.50"
formatMoney(1000n, 'JPY', 'ja-JP') // "¥1,000"
```
