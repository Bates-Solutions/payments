[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrderPricingOptions

# Interface: OrderPricingOptions

Defined in: [squareup/src/core/types/index.ts:129](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L129)

Pricing options for an order. Controls automatic application of discounts
(pricing rules) and taxes.

## Properties

### autoApplyDiscounts?

> `optional` **autoApplyDiscounts?**: `boolean`

Defined in: [squareup/src/core/types/index.ts:141](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L141)

Apply catalog pricing rules (incl. customer-group-gated wholesale rules)
automatically at calculation time.

⚠️ **Not for subscription order templates.** Square rejects a subscription
template that sets this (`The order template amount must not have
auto_apply_discounts set to true`). For a template, carry prices explicitly
via each line's `basePriceMoney`, or reference discounts explicitly via the
order's `discounts` — either keeps the amount well-defined without
auto-application.

***

### autoApplyTaxes?

> `optional` **autoApplyTaxes?**: `boolean`

Defined in: [squareup/src/core/types/index.ts:145](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L145)

Apply all enabled taxes at the location automatically.
