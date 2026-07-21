[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / NormalizedSubscription

# Interface: NormalizedSubscription

Defined in: [core/services/subscriptions.service.ts:33](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L33)

A normalized subscription with a stable shape across Stripe API versions.

Notably, `currentPeriodStart` / `currentPeriodEnd` are surfaced as JS `Date`s
regardless of whether the pinned API version puts `current_period_*` on the
subscription (older) or on the subscription item (newer) — the wrapper reads
from the item first and falls back to the subscription.

## Properties

### cancelAtPeriodEnd

> **cancelAtPeriodEnd**: `boolean`

Defined in: [core/services/subscriptions.service.ts:44](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L44)

***

### canceledAt?

> `optional` **canceledAt?**: `Date`

Defined in: [core/services/subscriptions.service.ts:45](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L45)

***

### currentPeriodEnd?

> `optional` **currentPeriodEnd?**: `Date`

Defined in: [core/services/subscriptions.service.ts:43](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L43)

***

### currentPeriodStart?

> `optional` **currentPeriodStart?**: `Date`

Defined in: [core/services/subscriptions.service.ts:42](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L42)

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/services/subscriptions.service.ts:36](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L36)

***

### id

> **id**: `string`

Defined in: [core/services/subscriptions.service.ts:34](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L34)

***

### items

> **items**: [`NormalizedSubscriptionItem`](NormalizedSubscriptionItem.md)[]

Defined in: [core/services/subscriptions.service.ts:41](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L41)

***

### priceId?

> `optional` **priceId?**: `string`

Defined in: [core/services/subscriptions.service.ts:38](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L38)

Price ID of the first item — the common single-item case

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/services/subscriptions.service.ts:40](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L40)

Quantity of the first item

***

### raw

> **raw**: `Subscription`

Defined in: [core/services/subscriptions.service.ts:48](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L48)

The raw Stripe subscription, for anything not normalized here

***

### status

> **status**: `Status`

Defined in: [core/services/subscriptions.service.ts:35](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L35)

***

### trialEnd?

> `optional` **trialEnd?**: `Date`

Defined in: [core/services/subscriptions.service.ts:46](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/subscriptions.service.ts#L46)
