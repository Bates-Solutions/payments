[**@bates-solutions/squareup API Reference v3.0.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / fromCents

# Function: fromCents()

> **fromCents**(`cents`, `currency?`): `number`

Defined in: [squareup/src/core/utils.ts:73](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/utils.ts#L73)

Convert cents (smallest currency unit) to dollar amount

The currency's minor unit comes from ISO 4217 through `minorUnitExponent`
in payments-core, matched in any case. A code outside `CurrencyCode` gets
its own exponent (1000 for `KWD`, 1 for `KRW`).

## Parameters

### cents

`number` \| `bigint`

Amount in smallest currency unit

### currency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"` = `'USD'`

Currency code (default: USD)

## Returns

`number`

Dollar amount

## Throws

When `currency` is not a string, or is empty or only whitespace

## Example

```typescript
fromCents(1050n) // 10.50
fromCents(1050n, 'USD') // 10.50
fromCents(1000n, 'JPY') // 1000
```
