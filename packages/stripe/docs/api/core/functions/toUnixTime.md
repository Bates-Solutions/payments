[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / toUnixTime

# Function: toUnixTime()

> **toUnixTime**(`value`, `field?`): `number`

Defined in: [stripe/src/core/utils.ts:249](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/utils.ts#L249)

Convert a JS `Date` to Unix seconds, the time format Stripe expects. A
number is taken to be Unix seconds already and passed through.

## Parameters

### value

`number` \| `Date`

A `Date`, or whole Unix seconds

### field?

`string` = `'value'`

Field name reported on a validation error

## Returns

`number`

## Throws

When the value is an invalid `Date`, not a
  whole number, or looks like milliseconds (above 1e11, i.e. after the year
  5000)

## Example

```typescript
toUnixTime(new Date('2026-03-01T00:00:00Z')); // 1772323200
```
