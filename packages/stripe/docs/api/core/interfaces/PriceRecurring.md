[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PriceRecurring

# Interface: PriceRecurring

Defined in: [stripe/src/core/services/prices.service.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L32)

Billing interval for a recurring price.

## Properties

### interval

> **interval**: `"day"` \| `"week"` \| `"month"` \| `"year"`

Defined in: [stripe/src/core/services/prices.service.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L34)

How often the price is charged

***

### intervalCount?

> `optional` **intervalCount?**: `number`

Defined in: [stripe/src/core/services/prices.service.ts:39](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L39)

Number of intervals between charges (e.g. `3` with `month` is quarterly).

#### Default

```ts
1
```
