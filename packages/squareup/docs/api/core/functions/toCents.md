[**@bates-solutions/squareup API Reference v3.0.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / toCents

# Function: toCents()

> **toCents**(`amount`, `currency?`): `bigint`

Defined in: [squareup/src/core/utils.ts:48](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/utils.ts#L48)

Convert a dollar amount to cents (smallest currency unit)

The currency's minor unit comes from ISO 4217 through `minorUnitExponent`
in payments-core, matched in any case. A code outside `CurrencyCode` gets
its own multiplier (1000 for `KWD`, 1 for `KRW`).

## Parameters

### amount

`number`

Dollar amount (e.g., 10.50)

### currency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"` = `'USD'`

Currency code (default: USD)

## Returns

`bigint`

Amount in smallest currency unit (e.g., 1050 for $10.50 USD)

## Throws

When `currency` is not a string, or is empty or only whitespace

## Example

```typescript
toCents(10.50) // 1050
toCents(10.50, 'USD') // 1050
toCents(1000, 'JPY') // 1000 (JPY has no decimal places)
```
