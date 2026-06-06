[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrderPricingOptions

# Interface: OrderPricingOptions

Defined in: [core/types/index.ts:80](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L80)

Pricing options for an order. Controls automatic application of discounts
(pricing rules) and taxes.

## Properties

### autoApplyDiscounts?

> `optional` **autoApplyDiscounts?**: `boolean`

Defined in: [core/types/index.ts:86](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L86)

Apply catalog pricing rules (incl. customer-group-gated wholesale rules)
automatically at calculation time. Required for order templates that back
subscriptions with per-retailer wholesale pricing.

***

### autoApplyTaxes?

> `optional` **autoApplyTaxes?**: `boolean`

Defined in: [core/types/index.ts:90](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L90)

Apply all enabled taxes at the location automatically.
