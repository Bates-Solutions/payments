[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateSubscriptionOptions

# Interface: CreateSubscriptionOptions

Defined in: [squareup/src/core/services/subscriptions.service.ts:113](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L113)

Options for creating a subscription.

One of `planVariationId` or `phases[]` must be provided. A plan variation
drives flat-rate (STATIC) or percentage-of-template (RELATIVE) pricing;
phases drive product-based billing from order templates.

## Properties

### cardId?

> `optional` **cardId?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:126](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L126)

***

### customerId

> **customerId**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:114](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L114)

***

### idempotencyKey

> **idempotencyKey**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:134](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L134)

Required. Square creates the subscription once per key, so a retry with
the same key cannot create (and bill) a second one. At most 45 characters.

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:124](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L124)

***

### phases?

> `optional` **phases?**: [`SubscriptionPhaseInput`](SubscriptionPhaseInput.md)[]

Defined in: [squareup/src/core/services/subscriptions.service.ts:123](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L123)

Ordered list of billing phases. Each phase references an order template
that defines the line items billed during that phase.

***

### planVariationId?

> `optional` **planVariationId?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:118](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L118)

Plan variation ID. Required when `phases` is omitted.

***

### priceOverride?

> `optional` **priceOverride?**: `number`

Defined in: [squareup/src/core/services/subscriptions.service.ts:128](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L128)

***

### startDate?

> `optional` **startDate?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:125](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L125)

***

### taxPercentage?

> `optional` **taxPercentage?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:129](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L129)

***

### timezone?

> `optional` **timezone?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:127](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L127)
