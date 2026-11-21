[**@bates-solutions/clover API Reference v1.2.1**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / toCents

# Function: toCents()

> **toCents**(`amount`, `currency?`): `number`

Defined in: [clover/src/core/utils.ts:48](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/utils.ts#L48)

Convert a major-unit amount to cents (the currency's smallest unit).

The currency's minor unit comes from ISO 4217 through `minorUnitExponent`
in payments-core, matched in any case. Every `CurrencyCode` has two
decimals; a code outside it gets its own multiplier (1 for `jpy`, 1000 for
`kwd`).

## Parameters

### amount

`number`

Major-unit amount (e.g. 10.50 dollars)

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code (default: usd)

## Returns

`number`

Amount in the smallest unit (e.g. 1050)

## Throws

When `currency` is not a string, or is empty or only whitespace

## Example

```typescript
toCents(10.50); // 1050
toCents(10.50, 'cad'); // 1050
```
