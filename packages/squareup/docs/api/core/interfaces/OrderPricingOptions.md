[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrderPricingOptions

# Interface: OrderPricingOptions

Defined in: [core/types/index.ts:93](https://github.com/mbates/squareup/blob/9247d66f2d6844e833a2dc69bc01a9537b493e7a/src/core/types/index.ts#L93)

Pricing options for an order. Controls automatic application of discounts
(pricing rules) and taxes.

## Properties

### autoApplyDiscounts?

> `optional` **autoApplyDiscounts?**: `boolean`

Defined in: [core/types/index.ts:99](https://github.com/mbates/squareup/blob/9247d66f2d6844e833a2dc69bc01a9537b493e7a/src/core/types/index.ts#L99)

Apply catalog pricing rules (incl. customer-group-gated wholesale rules)
automatically at calculation time. Required for order templates that back
subscriptions with per-retailer wholesale pricing.

***

### autoApplyTaxes?

> `optional` **autoApplyTaxes?**: `boolean`

Defined in: [core/types/index.ts:103](https://github.com/mbates/squareup/blob/9247d66f2d6844e833a2dc69bc01a9537b493e7a/src/core/types/index.ts#L103)

Apply all enabled taxes at the location automatically.
