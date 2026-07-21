[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaymentsService

# Class: PaymentsService

Defined in: [core/services/payments.service.ts:35](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/payments.service.ts#L35)

Payments service wrapping Stripe PaymentIntents.

## Example

```typescript
const payment = await stripe.payments.create({
  amount: 1000, // $10.00 in cents
  currency: 'usd',
  paymentMethod: 'pm_card_visa',
  confirm: true,
});
```

## Constructors

### Constructor

> **new PaymentsService**(`client`): `PaymentsService`

Defined in: [core/services/payments.service.ts:36](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/payments.service.ts#L36)

#### Parameters

##### client

`Stripe`

#### Returns

`PaymentsService`

## Methods

### cancel()

> **cancel**(`paymentId`): `Promise`\<`PaymentIntent`\>

Defined in: [core/services/payments.service.ts:133](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/payments.service.ts#L133)

Cancel a payment.

#### Parameters

##### paymentId

`string`

PaymentIntent ID to cancel

#### Returns

`Promise`\<`PaymentIntent`\>

The cancelled PaymentIntent

#### Example

```typescript
const payment = await stripe.payments.cancel('pi_123');
```

***

### capture()

> **capture**(`paymentId`): `Promise`\<`PaymentIntent`\>

Defined in: [core/services/payments.service.ts:114](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/payments.service.ts#L114)

Capture a payment that was authorized with `capture_method: manual`.

#### Parameters

##### paymentId

`string`

PaymentIntent ID to capture

#### Returns

`Promise`\<`PaymentIntent`\>

The captured PaymentIntent

#### Example

```typescript
const payment = await stripe.payments.capture('pi_123');
```

***

### create()

> **create**(`options`): `Promise`\<`PaymentIntent`\>

Defined in: [core/services/payments.service.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/payments.service.ts#L58)

Create a payment (PaymentIntent).

#### Parameters

##### options

[`CreatePaymentOptions`](../interfaces/CreatePaymentOptions.md)

Payment creation options

#### Returns

`Promise`\<`PaymentIntent`\>

Created PaymentIntent

#### Throws

When input validation fails

#### Throws

When the card is declined

#### Example

```typescript
const payment = await stripe.payments.create({
  amount: 1000,
  currency: 'usd',
  customerId: 'cus_123',
  paymentMethod: 'pm_card_visa',
  confirm: true,
});
```

***

### get()

> **get**(`paymentId`): `Promise`\<`PaymentIntent`\>

Defined in: [core/services/payments.service.ts:95](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/payments.service.ts#L95)

Retrieve a payment by ID.

#### Parameters

##### paymentId

`string`

PaymentIntent ID

#### Returns

`Promise`\<`PaymentIntent`\>

The PaymentIntent

#### Example

```typescript
const payment = await stripe.payments.get('pi_123');
```

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`PaymentIntent`\>\>

Defined in: [core/services/payments.service.ts:153](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/payments.service.ts#L153)

List payments with cursor-based pagination.

#### Parameters

##### options?

[`ListPaymentsOptions`](../interfaces/ListPaymentsOptions.md)

List options

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`PaymentIntent`\>\>

Payments and a cursor for the next page

#### Example

```typescript
const page1 = await stripe.payments.list({ limit: 20 });
const page2 = await stripe.payments.list({ startingAfter: page1.nextCursor });
```
