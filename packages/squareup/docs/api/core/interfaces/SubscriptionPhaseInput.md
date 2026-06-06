[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SubscriptionPhaseInput

# Interface: SubscriptionPhaseInput

Defined in: [core/services/subscriptions.service.ts:87](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L87)

A subscription phase that bills from an order template.

Use with `orders.create({ state: 'DRAFT', pricingOptions: { autoApplyDiscounts: true } })`
(or `orders.builder().asTemplate()`) to drive product-based recurring billing —
each cycle invoices the line items on the template, re-applying catalog
pricing rules (e.g. customer-group wholesale tiers) at calculation time.

## Properties

### orderTemplateId

> **orderTemplateId**: `string`

Defined in: [core/services/subscriptions.service.ts:98](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L98)

ID of a DRAFT order created via `square.orders.create(...)` that defines
what ships each billing cycle.

***

### ordinal?

> `optional` **ordinal?**: `number` \| `bigint`

Defined in: [core/services/subscriptions.service.ts:93](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L93)

Position of this phase in the subscription's phase sequence. Defaults to
array position when omitted. Accepts a number or bigint — coerced to
bigint at the SDK boundary.
