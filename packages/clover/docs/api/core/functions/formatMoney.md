[**@bates-solutions/clover API Reference v1.2.1**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / formatMoney

# Function: formatMoney()

> **formatMoney**(`cents`, `currency?`, `locale?`): `string`

Defined in: [clover/src/core/utils.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/utils.ts#L91)

Format money for display.

## Parameters

### cents

`number`

Amount in the currency's smallest unit

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code (default: usd)

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
formatMoney(1050); // "$10.50"
```
