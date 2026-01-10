[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SubscriptionsService

# Class: SubscriptionsService

Defined in: [src/core/services/subscriptions.service.ts:109](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L109)

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

Defined in: [src/core/services/subscriptions.service.ts:110](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L110)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

#### Returns

`SubscriptionsService`

## Methods

### cancel()

> **cancel**(`subscriptionId`): `Promise`\<`Subscription`\>

Defined in: [src/core/services/subscriptions.service.ts:258](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L258)

Cancel a subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID to cancel

#### Returns

`Promise`\<`Subscription`\>

Cancelled subscription

#### Example

```typescript
const subscription = await square.subscriptions.cancel('SUB_123');
```

***

### create()

> **create**(`options`): `Promise`\<`Subscription`\>

Defined in: [src/core/services/subscriptions.service.ts:130](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L130)

Create a new subscription

#### Parameters

##### options

`CreateSubscriptionOptions`

Subscription creation options

#### Returns

`Promise`\<`Subscription`\>

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

> **get**(`subscriptionId`): `Promise`\<`Subscription`\>

Defined in: [src/core/services/subscriptions.service.ts:186](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L186)

Get a subscription by ID

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`Promise`\<`Subscription`\>

Subscription details

#### Example

```typescript
const subscription = await square.subscriptions.get('SUB_123');
```

***

### pause()

> **pause**(`subscriptionId`, `options?`): `Promise`\<`Subscription`\>

Defined in: [src/core/services/subscriptions.service.ts:286](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L286)

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

`Promise`\<`Subscription`\>

Paused subscription

#### Example

```typescript
const subscription = await square.subscriptions.pause('SUB_123', {
  pauseEffectiveDate: '2024-03-01',
});
```

***

### resume()

> **resume**(`subscriptionId`, `resumeEffectiveDate?`): `Promise`\<`Subscription`\>

Defined in: [src/core/services/subscriptions.service.ts:324](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L324)

Resume a paused subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID to resume

##### resumeEffectiveDate?

`string`

Optional date to resume

#### Returns

`Promise`\<`Subscription`\>

Resumed subscription

#### Example

```typescript
const subscription = await square.subscriptions.resume('SUB_123');
```

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: `Subscription`[]; \}\>

Defined in: [src/core/services/subscriptions.service.ts:354](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L354)

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

`Promise`\<\{ `cursor?`: `string`; `data`: `Subscription`[]; \}\>

Matching subscriptions with pagination

#### Example

```typescript
const results = await square.subscriptions.search({
  customerId: 'CUST_123',
});
```

***

### update()

> **update**(`subscriptionId`, `options`): `Promise`\<`Subscription`\>

Defined in: [src/core/services/subscriptions.service.ts:214](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/subscriptions.service.ts#L214)

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

`Promise`\<`Subscription`\>

Updated subscription

#### Example

```typescript
const subscription = await square.subscriptions.update('SUB_123', {
  priceOverride: 1500,
});
```
