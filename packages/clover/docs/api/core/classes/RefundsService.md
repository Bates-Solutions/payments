[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / RefundsService

# Class: RefundsService

Defined in: core/services/refunds.service.ts:45

Refunds service wrapping Clover's Ecommerce
[refunds](https://docs.clover.com/dev/docs/ecommerce-refunding-payments) (`/v1/refunds`).

## Remarks

`/v1/refunds` refunds charges created with `/v1/charges`. Partial refunds are
not supported for charges that include taxes/tips or more than one line item.

## Example

```typescript
const refund = await clover.refunds.create({ chargeId: 'CHG_123' });
```

## Constructors

### Constructor

> **new RefundsService**(`http`): `RefundsService`

Defined in: core/services/refunds.service.ts:46

#### Parameters

##### http

[`CloverHttp`](CloverHttp.md)

#### Returns

`RefundsService`

## Methods

### create()

> **create**(`options`): `Promise`\<[`Refund`](../interfaces/Refund.md)\>

Defined in: core/services/refunds.service.ts:53

Create a refund for a charge.

#### Parameters

##### options

[`CreateRefundOptions`](../interfaces/CreateRefundOptions.md)

#### Returns

`Promise`\<[`Refund`](../interfaces/Refund.md)\>

#### Throws

When `chargeId` is missing or `amount` is non-positive

***

### get()

> **get**(`refundId`): `Promise`\<[`Refund`](../interfaces/Refund.md)\>

Defined in: core/services/refunds.service.ts:78

Retrieve a refund by ID.

#### Parameters

##### refundId

`string`

#### Returns

`Promise`\<[`Refund`](../interfaces/Refund.md)\>
