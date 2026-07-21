[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / SubscriptionsService

# Class: SubscriptionsService

Defined in: core/services/subscriptions.service.ts:120

Subscriptions service wrapping Stripe [Subscriptions](https://docs.stripe.com/api/subscriptions).

Read methods return a [NormalizedSubscription](../interfaces/NormalizedSubscription.md); the raw Stripe object is
always available on `.raw`.

## Example

```typescript
const sub = await stripe.subscriptions.retrieve('sub_123');
sub.currentPeriodEnd; // a JS Date
sub.priceId;          // 'price_…'
```

## Constructors

### Constructor

> **new SubscriptionsService**(`client`): `SubscriptionsService`

Defined in: core/services/subscriptions.service.ts:121

#### Parameters

##### client

`Stripe`

#### Returns

`SubscriptionsService`

## Methods

### cancel()

> **cancel**(`subscriptionId`, `options?`): `Promise`\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>

Defined in: core/services/subscriptions.service.ts:160

Cancel a subscription, immediately or at period end.

#### Parameters

##### subscriptionId

`string`

##### options?

[`CancelSubscriptionOptions`](../interfaces/CancelSubscriptionOptions.md)

#### Returns

`Promise`\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>\>

Defined in: core/services/subscriptions.service.ts:138

List subscriptions with cursor-based pagination, normalized.

#### Parameters

##### options?

[`ListSubscriptionsOptions`](../interfaces/ListSubscriptionsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>\>

***

### resume()

> **resume**(`subscriptionId`): `Promise`\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>

Defined in: core/services/subscriptions.service.ts:177

Resume a subscription that was set to cancel at period end.

#### Parameters

##### subscriptionId

`string`

#### Returns

`Promise`\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>

***

### retrieve()

> **retrieve**(`subscriptionId`): `Promise`\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>

Defined in: core/services/subscriptions.service.ts:126

Retrieve a subscription by ID, normalized.

#### Parameters

##### subscriptionId

`string`

#### Returns

`Promise`\<[`NormalizedSubscription`](../interfaces/NormalizedSubscription.md)\>
