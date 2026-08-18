[**@bates-solutions/squareup API Reference v1.15.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / PaymentsService

# Class: PaymentsService

Defined in: [core/services/payments.service.ts:37](https://github.com/mbates/squareup/blob/main/src/core/services/payments.service.ts#L37)

Simplified payments service

## Example

```typescript
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000, // $10.00 in cents
});
```

## Constructors

### Constructor

> **new PaymentsService**(`client`, `defaultLocationId?`, `defaultCurrency?`): `PaymentsService`

Defined in: [core/services/payments.service.ts:38](https://github.com/mbates/squareup/blob/main/src/core/services/payments.service.ts#L38)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

##### defaultCurrency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

#### Returns

`PaymentsService`

## Methods

### cancel()

> **cancel**(`paymentId`): `Promise`\<`Payment`\>

Defined in: [core/services/payments.service.ts:154](https://github.com/mbates/squareup/blob/main/src/core/services/payments.service.ts#L154)

Cancel a payment

#### Parameters

##### paymentId

`string`

Payment ID to cancel

#### Returns

`Promise`\<`Payment`\>

Cancelled payment

#### Example

```typescript
const payment = await square.payments.cancel('PAYMENT_123');
```

***

### complete()

> **complete**(`paymentId`): `Promise`\<`Payment`\>

Defined in: [core/services/payments.service.ts:179](https://github.com/mbates/squareup/blob/main/src/core/services/payments.service.ts#L179)

Complete a payment (for payments created with autocomplete: false)

#### Parameters

##### paymentId

`string`

Payment ID to complete

#### Returns

`Promise`\<`Payment`\>

Completed payment

#### Example

```typescript
const payment = await square.payments.complete('PAYMENT_123');
```

***

### create()

> **create**(`options`): `Promise`\<`Payment`\>

Defined in: [core/services/payments.service.ts:73](https://github.com/mbates/squareup/blob/main/src/core/services/payments.service.ts#L73)

Create a payment

#### Parameters

##### options

[`CreatePaymentOptions`](../interfaces/CreatePaymentOptions.md)

Payment creation options

#### Returns

`Promise`\<`Payment`\>

Created payment

#### Throws

When payment processing fails

#### Throws

When input validation fails

#### Example

```typescript
// Simple payment
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000, // $10.00 in cents
});

// Payment with all options
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000,
  currency: 'USD',
  customerId: 'CUST_123',
  orderId: 'ORDER_123',
  note: 'Payment for order #123',
  autocomplete: true,
});
```

***

### get()

> **get**(`paymentId`): `Promise`\<`Payment`\>

Defined in: [core/services/payments.service.ts:129](https://github.com/mbates/squareup/blob/main/src/core/services/payments.service.ts#L129)

Get a payment by ID

#### Parameters

##### paymentId

`string`

Payment ID

#### Returns

`Promise`\<`Payment`\>

Payment details

#### Example

```typescript
const payment = await square.payments.get('PAYMENT_123');
```

***

### list()

> **list**(`options?`): `Promise`\<`Payment`[]\>

Defined in: [core/services/payments.service.ts:206](https://github.com/mbates/squareup/blob/main/src/core/services/payments.service.ts#L206)

List payments with optional filters

#### Parameters

##### options?

List options

###### limit?

`number`

###### locationId?

`string`

#### Returns

`Promise`\<`Payment`[]\>

Array of payments

#### Example

```typescript
const payments = await square.payments.list({
  limit: 10,
});
```
