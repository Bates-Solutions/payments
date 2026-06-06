[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateOrderOptions

# Interface: CreateOrderOptions

Defined in: [core/types/index.ts:96](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L96)

Create order options

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/types/index.ts:98](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L98)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/types/index.ts:110](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L110)

***

### lineItems

> **lineItems**: [`LineItemInput`](LineItemInput.md)[]

Defined in: [core/types/index.ts:97](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L97)

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [core/types/index.ts:109](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L109)

Override the client's default location for this order.

***

### pricingOptions?

> `optional` **pricingOptions?**: [`OrderPricingOptions`](OrderPricingOptions.md)

Defined in: [core/types/index.ts:105](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L105)

***

### referenceId?

> `optional` **referenceId?**: `string`

Defined in: [core/types/index.ts:99](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L99)

***

### state?

> `optional` **state?**: `"DRAFT"` \| `"OPEN"`

Defined in: [core/types/index.ts:104](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/types/index.ts#L104)

Order state. Use `'DRAFT'` when creating an order template that will back
a subscription phase (`subscriptions.create({ phases: [...] })`).
