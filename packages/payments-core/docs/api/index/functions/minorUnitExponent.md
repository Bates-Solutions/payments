[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / minorUnitExponent

# Function: minorUnitExponent()

> **minorUnitExponent**(`currency`): [`MinorUnitExponent`](../type-aliases/MinorUnitExponent.md)

Defined in: [currency/minor-units.ts:72](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/currency/minor-units.ts#L72)

The ISO 4217 minor-unit exponent of a currency: `0` for currencies with no
minor unit, such as `JPY` and `KRW`; `3` for `BHD`, `IQD`, `JOD`, `KWD`,
`LYD`, `OMR` and `TND`; `4` for `CLF` and `UYW`; and `2` for every other
code, including codes it does not know.

Matching is case-insensitive (`'jpy'` and `'JPY'` give the same answer) and
covers three-letter ASCII codes only; anything else gives `2`. Provider rules
that differ from ISO stay in the provider package: Stripe, for example, takes
`ISK` and `UGX` as two-decimal values and `MGA` as zero-decimal.

## Parameters

### currency

`string`

An ISO 4217 currency code, any case.

## Returns

[`MinorUnitExponent`](../type-aliases/MinorUnitExponent.md)

The number of decimal places in the currency's minor unit.

## Throws

When `currency` is not a non-empty string.

## Example

```typescript
minorUnitExponent('USD'); // 2
minorUnitExponent('jpy'); // 0
minorUnitExponent('KWD'); // 3

// 10.50 USD in minor units
Math.round(10.5 * 10 ** minorUnitExponent('USD')); // 1050
```

## See

https://www.iso.org/iso-4217-currency-codes.html
