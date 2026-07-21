[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / NormalizedSubscription

# Interface: NormalizedSubscription

Defined in: core/services/subscriptions.service.ts:33

A normalized subscription with a stable shape across Stripe API versions.

Notably, `currentPeriodStart` / `currentPeriodEnd` are surfaced as JS `Date`s
regardless of whether the pinned API version puts `current_period_*` on the
subscription (older) or on the subscription item (newer) — the wrapper reads
from the item first and falls back to the subscription.

## Properties

### cancelAtPeriodEnd

> **cancelAtPeriodEnd**: `boolean`

Defined in: core/services/subscriptions.service.ts:44

***

### canceledAt?

> `optional` **canceledAt?**: `Date`

Defined in: core/services/subscriptions.service.ts:45

***

### currentPeriodEnd?

> `optional` **currentPeriodEnd?**: `Date`

Defined in: core/services/subscriptions.service.ts:43

***

### currentPeriodStart?

> `optional` **currentPeriodStart?**: `Date`

Defined in: core/services/subscriptions.service.ts:42

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: core/services/subscriptions.service.ts:36

***

### id

> **id**: `string`

Defined in: core/services/subscriptions.service.ts:34

***

### items

> **items**: [`NormalizedSubscriptionItem`](NormalizedSubscriptionItem.md)[]

Defined in: core/services/subscriptions.service.ts:41

***

### priceId?

> `optional` **priceId?**: `string`

Defined in: core/services/subscriptions.service.ts:38

Price ID of the first item — the common single-item case

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: core/services/subscriptions.service.ts:40

Quantity of the first item

***

### raw

> **raw**: `Subscription`

Defined in: core/services/subscriptions.service.ts:48

The raw Stripe subscription, for anything not normalized here

***

### status

> **status**: `Status`

Defined in: core/services/subscriptions.service.ts:35

***

### trialEnd?

> `optional` **trialEnd?**: `Date`

Defined in: core/services/subscriptions.service.ts:46
