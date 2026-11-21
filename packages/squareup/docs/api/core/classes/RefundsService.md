[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / RefundsService

# Class: RefundsService

Defined in: [squareup/src/core/services/refunds.service.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/refunds.service.ts#L27)

Refunds of Square payments

## Example

```typescript
const refund = await square.refunds.refundPayment({
  paymentId: 'PAYMENT_123',
  amountMoney: { amount: 500 }, // $5.00
  idempotencyKey: createIdempotencyKey(),
});
```

## Constructors

### Constructor

> **new RefundsService**(`client`, `defaultCurrency?`): `RefundsService`

Defined in: [squareup/src/core/services/refunds.service.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/refunds.service.ts#L28)

#### Parameters

##### client

`SquareClient`

##### defaultCurrency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"` = `'USD'`

#### Returns

`RefundsService`

## Methods

### get()

> **get**(`refundId`): `Promise`\<[`PaymentRefund`](../interfaces/PaymentRefund.md)\>

Defined in: [squareup/src/core/services/refunds.service.ts:98](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/refunds.service.ts#L98)

Get a refund by ID

#### Parameters

##### refundId

`string`

Refund ID

#### Returns

`Promise`\<[`PaymentRefund`](../interfaces/PaymentRefund.md)\>

Refund details

#### Example

```typescript
const refund = await square.refunds.get('REFUND_123');
```

***

### list()

> **list**(`options?`): `Promise`\<\{ `cursor?`: `string`; `refunds`: [`PaymentRefund`](../interfaces/PaymentRefund.md)[]; \}\>

Defined in: [squareup/src/core/services/refunds.service.ts:127](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/refunds.service.ts#L127)

List refunds, one page at a time

#### Parameters

##### options?

[`ListRefundsOptions`](../interfaces/ListRefundsOptions.md)

Filters, page size and the cursor of the page to fetch

#### Returns

`Promise`\<\{ `cursor?`: `string`; `refunds`: [`PaymentRefund`](../interfaces/PaymentRefund.md)[]; \}\>

One page of refunds, and the cursor of the next page if there is one

#### Example

```typescript
const page1 = await square.refunds.list({ status: 'COMPLETED', limit: 50 });
const page2 = await square.refunds.list({ status: 'COMPLETED', cursor: page1.cursor });
```

***

### refundPayment()

> **refundPayment**(`options`): `Promise`\<[`PaymentRefund`](../interfaces/PaymentRefund.md)\>

Defined in: [squareup/src/core/services/refunds.service.ts:54](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/refunds.service.ts#L54)

Refund all or part of a payment

The refund starts `PENDING`; Square sends `refund.updated` when it
completes or fails.

#### Parameters

##### options

[`RefundPaymentOptions`](../interfaces/RefundPaymentOptions.md)

Refund options

#### Returns

`Promise`\<[`PaymentRefund`](../interfaces/PaymentRefund.md)\>

The refund

#### Throws

When `paymentId` or `idempotencyKey` is missing, or the amount is not positive

#### Example

```typescript
const refund = await square.refunds.refundPayment({
  paymentId: 'PAYMENT_123',
  amountMoney: { amount: 500, currency: 'USD' },
  idempotencyKey: 'refund-order-123',
  reason: 'Damaged item',
});
```
