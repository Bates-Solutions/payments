[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateSubscriptionOptions

# Interface: CreateSubscriptionOptions

Defined in: [core/services/subscriptions.service.ts:108](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L108)

Options for creating a subscription.

One of `planVariationId` or `phases[]` must be provided. A plan variation
drives flat-rate (STATIC) or percentage-of-template (RELATIVE) pricing;
phases drive product-based billing from order templates.

## Properties

### cardId?

> `optional` **cardId?**: `string`

Defined in: [core/services/subscriptions.service.ts:121](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L121)

***

### customerId

> **customerId**: `string`

Defined in: [core/services/subscriptions.service.ts:109](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L109)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/subscriptions.service.ts:125](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L125)

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [core/services/subscriptions.service.ts:119](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L119)

***

### phases?

> `optional` **phases?**: [`SubscriptionPhaseInput`](SubscriptionPhaseInput.md)[]

Defined in: [core/services/subscriptions.service.ts:118](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L118)

Ordered list of billing phases. Each phase references an order template
that defines the line items billed during that phase.

***

### planVariationId?

> `optional` **planVariationId?**: `string`

Defined in: [core/services/subscriptions.service.ts:113](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L113)

Plan variation ID. Required when `phases` is omitted.

***

### priceOverride?

> `optional` **priceOverride?**: `number`

Defined in: [core/services/subscriptions.service.ts:123](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L123)

***

### startDate?

> `optional` **startDate?**: `string`

Defined in: [core/services/subscriptions.service.ts:120](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L120)

***

### taxPercentage?

> `optional` **taxPercentage?**: `string`

Defined in: [core/services/subscriptions.service.ts:124](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L124)

***

### timezone?

> `optional` **timezone?**: `string`

Defined in: [core/services/subscriptions.service.ts:122](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L122)
