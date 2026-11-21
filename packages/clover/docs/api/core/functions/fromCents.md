[**@bates-solutions/clover API Reference v1.2.1**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / fromCents

# Function: fromCents()

> **fromCents**(`cents`, `currency?`): `number`

Defined in: [clover/src/core/utils.ts:73](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/utils.ts#L73)

Convert cents (the currency's smallest unit) to a major-unit amount.

The currency's minor unit comes from ISO 4217 through `minorUnitExponent`
in payments-core, matched in any case. Every `CurrencyCode` has two
decimals; a code outside it gets its own exponent (1 for `jpy`, 1000 for
`kwd`).

## Parameters

### cents

`number`

Amount in the smallest unit

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code (default: usd)

## Returns

`number`

Major-unit amount

## Throws

When `currency` is not a string, or is empty or only whitespace

## Example

```typescript
fromCents(1050); // 10.50
fromCents(1050, 'gbp'); // 10.50
```
