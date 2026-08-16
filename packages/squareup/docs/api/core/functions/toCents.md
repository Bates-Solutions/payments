[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / toCents

# Function: toCents()

> **toCents**(`amount`, `currency?`): `bigint`

Defined in: [core/utils.ts:38](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/utils.ts#L38)

Convert a dollar amount to cents (smallest currency unit)

## Parameters

### amount

`number`

Dollar amount (e.g., 10.50)

### currency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

Currency code (default: USD)

## Returns

`bigint`

Amount in smallest currency unit (e.g., 1050 for $10.50 USD)

## Example

```typescript
toCents(10.50) // 1050
toCents(10.50, 'USD') // 1050
toCents(1000, 'JPY') // 1000 (JPY has no decimal places)
```
