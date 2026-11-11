[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / TimeRange

# Interface: TimeRange

Defined in: [core/types/index.ts:43](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L43)

A time range filter, e.g. on an object's `created` time. Each bound is a
`Date` or Unix seconds; omit a bound to leave that side open.

## Example

```typescript
// Everything created in March 2026 (UTC)
const march = { gte: new Date('2026-03-01T00:00:00Z'), lt: new Date('2026-04-01T00:00:00Z') };
```

## Properties

### gt?

> `optional` **gt?**: `number` \| `Date`

Defined in: [core/types/index.ts:47](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L47)

Strictly after

***

### gte?

> `optional` **gte?**: `number` \| `Date`

Defined in: [core/types/index.ts:45](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L45)

On or after

***

### lt?

> `optional` **lt?**: `number` \| `Date`

Defined in: [core/types/index.ts:51](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L51)

Strictly before

***

### lte?

> `optional` **lte?**: `number` \| `Date`

Defined in: [core/types/index.ts:49](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L49)

On or before
