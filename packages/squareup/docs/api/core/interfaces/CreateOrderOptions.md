[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateOrderOptions

# Interface: CreateOrderOptions

Defined in: [core/types/index.ts:109](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L109)

Create order options

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/types/index.ts:111](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L111)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/types/index.ts:123](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L123)

***

### lineItems

> **lineItems**: [`LineItemInput`](LineItemInput.md)[]

Defined in: [core/types/index.ts:110](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L110)

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [core/types/index.ts:122](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L122)

Override the client's default location for this order.

***

### pricingOptions?

> `optional` **pricingOptions?**: [`OrderPricingOptions`](OrderPricingOptions.md)

Defined in: [core/types/index.ts:118](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L118)

***

### referenceId?

> `optional` **referenceId?**: `string`

Defined in: [core/types/index.ts:112](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L112)

***

### state?

> `optional` **state?**: `"DRAFT"` \| `"OPEN"`

Defined in: [core/types/index.ts:117](https://github.com/mbates/squareup/blob/main/src/core/types/index.ts#L117)

Order state. Use `'DRAFT'` when creating an order template that will back
a subscription phase (`subscriptions.create({ phases: [...] })`).
