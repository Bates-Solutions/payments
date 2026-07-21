[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / RefundsService

# Class: RefundsService

Defined in: [core/services/refunds.service.ts:59](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L59)

Refunds service wrapping Stripe Refunds.

## Example

```typescript
const refund = await stripe.refunds.create({
  paymentIntentId: 'pi_123',
});
```

## Constructors

### Constructor

> **new RefundsService**(`client`): `RefundsService`

Defined in: [core/services/refunds.service.ts:60](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L60)

#### Parameters

##### client

`Stripe`

#### Returns

`RefundsService`

## Methods

### create()

> **create**(`options`): `Promise`\<`Refund`\>

Defined in: [core/services/refunds.service.ts:83](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L83)

Create a refund.

#### Parameters

##### options

[`CreateRefundOptions`](../interfaces/CreateRefundOptions.md)

Refund creation options

#### Returns

`Promise`\<`Refund`\>

The created refund

#### Throws

When neither a payment nor charge is given

#### Example

```typescript
// Full refund of a payment
const refund = await stripe.refunds.create({ paymentIntentId: 'pi_123' });

// Partial refund
const partial = await stripe.refunds.create({
  paymentIntentId: 'pi_123',
  amount: 500,
  reason: 'requested_by_customer',
});
```

***

### get()

> **get**(`refundId`): `Promise`\<`Refund`\>

Defined in: [core/services/refunds.service.ts:120](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L120)

Retrieve a refund by ID.

#### Parameters

##### refundId

`string`

Refund ID

#### Returns

`Promise`\<`Refund`\>

The refund

#### Example

```typescript
const refund = await stripe.refunds.get('re_123');
```

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Refund`\>\>

Defined in: [core/services/refunds.service.ts:139](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L139)

List refunds with cursor-based pagination.

#### Parameters

##### options?

[`ListRefundsOptions`](../interfaces/ListRefundsOptions.md)

List options

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Refund`\>\>

Refunds and a cursor for the next page

#### Example

```typescript
const { data } = await stripe.refunds.list({ paymentIntentId: 'pi_123' });
```
