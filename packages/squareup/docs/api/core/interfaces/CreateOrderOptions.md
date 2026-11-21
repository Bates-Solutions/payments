[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateOrderOptions

# Interface: CreateOrderOptions

Defined in: [squareup/src/core/types/index.ts:192](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L192)

Create order options

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [squareup/src/core/types/index.ts:194](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L194)

***

### discounts?

> `optional` **discounts?**: [`OrderDiscountInput`](OrderDiscountInput.md)[]

Defined in: [squareup/src/core/types/index.ts:203](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L203)

Order-level and line-level discounts. Reference `CatalogDiscount` ids to
keep pricing authoritative (the number tracks the catalog rather than being
copied into the order). For a subscription order template, carry discounts
(or explicit `basePriceMoney`) here rather than relying on
`pricingOptions.autoApplyDiscounts` — see [OrderPricingOptions](OrderPricingOptions.md).

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [squareup/src/core/types/index.ts:214](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L214)

***

### lineItems

> **lineItems**: [`LineItemInput`](LineItemInput.md)[]

Defined in: [squareup/src/core/types/index.ts:193](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L193)

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [squareup/src/core/types/index.ts:213](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L213)

Override the client's default location for this order.

***

### pricingOptions?

> `optional` **pricingOptions?**: [`OrderPricingOptions`](OrderPricingOptions.md)

Defined in: [squareup/src/core/types/index.ts:209](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L209)

***

### referenceId?

> `optional` **referenceId?**: `string`

Defined in: [squareup/src/core/types/index.ts:195](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L195)

***

### state?

> `optional` **state?**: `"DRAFT"` \| `"OPEN"`

Defined in: [squareup/src/core/types/index.ts:208](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L208)

Order state. Use `'DRAFT'` when creating an order template that will back
a subscription phase (`subscriptions.create({ phases: [...] })`).
