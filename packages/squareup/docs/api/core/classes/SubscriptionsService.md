[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SubscriptionsService

# Class: SubscriptionsService

Defined in: [squareup/src/core/services/subscriptions.service.ts:174](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L174)

Subscriptions service for managing Square subscriptions

## Example

```typescript
// Create a subscription
const subscription = await square.subscriptions.create({
  customerId: 'CUST_123',
  planVariationId: 'PLAN_VAR_123',
  idempotencyKey: createIdempotencyKey(),
});

// Cancel a subscription
await square.subscriptions.cancel('SUB_123');
```

## Constructors

### Constructor

> **new SubscriptionsService**(`client`, `defaultLocationId?`, `defaultCurrency?`): `SubscriptionsService`

Defined in: [squareup/src/core/services/subscriptions.service.ts:175](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L175)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

##### defaultCurrency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"` = `'USD'`

#### Returns

`SubscriptionsService`

## Methods

### cancel()

> **cancel**(`subscriptionId`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [squareup/src/core/services/subscriptions.service.ts:371](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L371)

Cancel a subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID to cancel

#### Returns

`Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Cancelled subscription

#### Example

```typescript
const subscription = await square.subscriptions.cancel('SUB_123');
```

***

### create()

> **create**(`options`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [squareup/src/core/services/subscriptions.service.ts:197](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L197)

Create a new subscription

#### Parameters

##### options

[`CreateSubscriptionOptions`](../interfaces/CreateSubscriptionOptions.md)

Subscription creation options

#### Returns

`Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Created subscription

#### Example

```typescript
const subscription = await square.subscriptions.create({
  customerId: 'CUST_123',
  planVariationId: 'PLAN_VAR_123',
  startDate: '2024-02-01',
  idempotencyKey: 'subscribe-CUST_123-PLAN_VAR_123',
});
```

***

### get()

> **get**(`subscriptionId`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [squareup/src/core/services/subscriptions.service.ts:275](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L275)

Get a subscription by ID

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Subscription details

#### Example

```typescript
const subscription = await square.subscriptions.get('SUB_123');
```

***

### pause()

> **pause**(`subscriptionId`, `options?`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [squareup/src/core/services/subscriptions.service.ts:400](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L400)

Pause a subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID to pause

##### options?

Pause options

###### pauseCycleDuration?

`number`

###### pauseEffectiveDate?

`string`

#### Returns

`Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Paused subscription

#### Example

```typescript
const subscription = await square.subscriptions.pause('SUB_123', {
  pauseEffectiveDate: '2024-03-01',
});
```

***

### resume()

> **resume**(`subscriptionId`, `resumeEffectiveDate?`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [squareup/src/core/services/subscriptions.service.ts:439](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L439)

Resume a paused subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID to resume

##### resumeEffectiveDate?

`string`

Optional date to resume

#### Returns

`Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Resumed subscription

#### Example

```typescript
const subscription = await square.subscriptions.resume('SUB_123');
```

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: [`Subscription`](../interfaces/Subscription.md)[]; \}\>

Defined in: [squareup/src/core/services/subscriptions.service.ts:470](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L470)

Search for subscriptions

#### Parameters

##### options?

Search options

###### cursor?

`string`

###### customerId?

`string`

###### limit?

`number`

###### locationIds?

`string`[]

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: [`Subscription`](../interfaces/Subscription.md)[]; \}\>

Matching subscriptions with pagination

#### Example

```typescript
const results = await square.subscriptions.search({
  customerId: 'CUST_123',
});
```

***

### update()

> **update**(`subscriptionId`, `options`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [squareup/src/core/services/subscriptions.service.ts:313](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L313)

Update a subscription

Only the fields you set change. Square's UpdateSubscription takes no
idempotency key; the change is a sparse overwrite, so resending the same
update is harmless.

#### Parameters

##### subscriptionId

`string`

Subscription ID

##### options

[`UpdateSubscriptionOptions`](../interfaces/UpdateSubscriptionOptions.md)

Update options

#### Returns

`Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Updated subscription

#### Throws

When both price override fields are set, or the amount is negative

#### Example

```typescript
// Move the subscription to a new card on file and a new price
const subscription = await square.subscriptions.update('SUB_123', {
  cardId: 'ccof:CARD_456',
  priceOverrideMoney: { amount: 1500, currency: 'USD' },
  taxPercentage: '8.5',
});
```
