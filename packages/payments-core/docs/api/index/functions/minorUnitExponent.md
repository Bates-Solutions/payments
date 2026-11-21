[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / minorUnitExponent

# Function: minorUnitExponent()

> **minorUnitExponent**(`currency`): [`MinorUnitExponent`](../type-aliases/MinorUnitExponent.md)

Defined in: [currency/minor-units.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/currency/minor-units.ts#L60)

The minor-unit exponent of a currency: `0` for zero-decimal currencies such
as `JPY` and `KRW`, `3` for `BHD`, `JOD`, `KWD`, `OMR` and `TND`, and `2`
for every other code, including codes it does not know.

Matching is case-insensitive, so `'jpy'` and `'JPY'` give the same answer.
Provider rules on top of this stay in the provider package: Stripe, for
example, takes `ISK` and `UGX` as two-decimal values.

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
