[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / toUnixTime

# Function: toUnixTime()

> **toUnixTime**(`value`, `field?`): `number`

Defined in: [core/utils.ts:265](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/utils.ts#L265)

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
