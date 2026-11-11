[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / fromMinor

# Function: fromMinor()

> **fromMinor**(`minor`, `currency?`): `number`

Defined in: [core/utils.ts:172](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/utils.ts#L172)

Convert an amount in the smallest currency unit to a major-unit amount.

Uses the same currency rules as [toMinor](toMinor.md) (case-insensitive): divides
by 1 for zero-decimal currencies, 1000 for three-decimal currencies and 100
otherwise (including `isk` and `ugx`).

## Parameters

### minor

`number`

Amount in the smallest currency unit

### currency?

[`CurrencyCode`](../type-aliases/CurrencyCode.md) = `'usd'`

Currency code, any case (default: usd)

## Returns

`number`

Major-unit amount

## Throws

If `currency` is not a non-empty string

## Example

```typescript
fromMinor(1050) // 10.50
fromMinor(1000, 'jpy') // 1000
fromMinor(5120, 'kwd') // 5.12
fromMinor(500, 'isk') // 5
```
