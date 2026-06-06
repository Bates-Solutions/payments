[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SubscriptionsService

# Class: SubscriptionsService

Defined in: [core/services/subscriptions.service.ts:143](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L143)

Subscriptions service for managing Square subscriptions

## Example

```typescript
// Create a subscription
const subscription = await square.subscriptions.create({
  customerId: 'CUST_123',
  planVariationId: 'PLAN_VAR_123',
});

// Cancel a subscription
await square.subscriptions.cancel('SUB_123');
```

## Constructors

### Constructor

> **new SubscriptionsService**(`client`, `defaultLocationId?`): `SubscriptionsService`

Defined in: [core/services/subscriptions.service.ts:144](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L144)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

#### Returns

`SubscriptionsService`

## Methods

### cancel()

> **cancel**(`subscriptionId`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [core/services/subscriptions.service.ts:311](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L311)

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

Defined in: [core/services/subscriptions.service.ts:164](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L164)

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
});
```

***

### get()

> **get**(`subscriptionId`): `Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Defined in: [core/services/subscriptions.service.ts:239](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L239)

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

Defined in: [core/services/subscriptions.service.ts:339](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L339)

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

Defined in: [core/services/subscriptions.service.ts:377](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L377)

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

Defined in: [core/services/subscriptions.service.ts:407](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L407)

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

Defined in: [core/services/subscriptions.service.ts:267](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/subscriptions.service.ts#L267)

Update a subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID

##### options

Update options

###### cardId?

`string`

###### priceOverride?

`number`

###### taxPercentage?

`string`

#### Returns

`Promise`\<[`Subscription`](../interfaces/Subscription.md)\>

Updated subscription

#### Example

```typescript
const subscription = await square.subscriptions.update('SUB_123', {
  priceOverride: 1500,
});
```
