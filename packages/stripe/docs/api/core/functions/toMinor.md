[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / toMinor

# Function: toMinor()

> **toMinor**(`amount`, `currency?`): `number`

Defined in: [core/utils.ts:132](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/utils.ts#L132)

Convert a major-unit amount to the smallest currency unit Stripe expects.

Follows Stripe's currency rules (currency matching is case-insensitive):

- Two-decimal (the default, e.g. `usd`, `eur`, `huf`, `twd`): × 100.
- Zero-decimal (`bif clp djf gnf jpy kmf krw mga pyg rwf vnd vuv xaf xof xpf`):
  × 1, rounded to a whole unit.
- Three-decimal (`bhd jod kwd omr tnd`): × 1000, rounded to the nearest 10
  because Stripe requires the last digit to be `0`.
- `isk` and `ugx`: rounded to a whole unit, then × 100 (Stripe takes them as
  two-decimal values whose decimals are always `00`).

Rounding is half away from zero, so a negative amount (e.g. a credit)
mirrors its positive: `toMinor(-5.5, 'isk')` is `-600`. A result of zero is
always `0`, never `-0`.

`huf` and `twd` payouts must be multiples of 100; this helper does not
enforce that, since charges in those currencies may use two decimals.

## Parameters

### amount

`number`

Major-unit amount (e.g. 10.50 dollars)

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code, any case (default: usd)

## Returns

`number`

Amount in the smallest currency unit (e.g. 1050 for $10.50)

## Throws

If `currency` is not a non-empty string, if
  `amount` is not a finite number, or if the result is beyond
  `Number.MAX_SAFE_INTEGER`

## Example

```typescript
toMinor(10.50) // 1050
toMinor(1000, 'jpy') // 1000 (JPY has no decimal places)
toMinor(5000, 'KRW') // 5000 (case-insensitive)
toMinor(5.124, 'kwd') // 5120 (three-decimal, last digit must be 0)
toMinor(5, 'isk') // 500 (two-decimal value, decimals always 00)
```

## See

https://docs.stripe.com/currencies
