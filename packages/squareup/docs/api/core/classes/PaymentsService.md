[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / PaymentsService

# Class: PaymentsService

Defined in: [squareup/src/core/services/payments.service.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/payments.service.ts#L42)

Simplified payments service

## Example

```typescript
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000, // $10.00 in cents
  idempotencyKey: createIdempotencyKey(),
});
```

## Constructors

### Constructor

> **new PaymentsService**(`client`, `defaultLocationId?`, `defaultCurrency?`): `PaymentsService`

Defined in: [squareup/src/core/services/payments.service.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/payments.service.ts#L43)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

##### defaultCurrency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"` = `'USD'`

#### Returns

`PaymentsService`

## Methods

### cancel()

> **cancel**(`paymentId`): `Promise`\<`Payment`\>

Defined in: [squareup/src/core/services/payments.service.ts:179](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/payments.service.ts#L179)

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

Defined in: [squareup/src/core/services/payments.service.ts:205](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/payments.service.ts#L205)

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

Defined in: [squareup/src/core/services/payments.service.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/payments.service.ts#L91)

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

When input validation fails, including a missing `idempotencyKey`

#### Example

```typescript
// Simple payment
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000, // $10.00 in cents
  idempotencyKey: createIdempotencyKey(),
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
  buyerEmailAddress: 'buyer@example.com',
  statementDescriptionIdentifier: 'ORDER123',
  idempotencyKey: 'order-123-payment',
});

// Merchant-initiated charge of a card on file (e.g. a renewal)
const payment = await square.payments.create({
  sourceId: 'ccof:CARD_123',
  customerId: 'CUST_123',
  amount: 1000,
  customerDetails: { customerInitiated: false, sellerKeyedIn: false },
  idempotencyKey: 'renewal-SUB_123-2026-12',
});
```

***

### get()

> **get**(`paymentId`): `Promise`\<`Payment`\>

Defined in: [squareup/src/core/services/payments.service.ts:153](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/payments.service.ts#L153)

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

Defined in: [squareup/src/core/services/payments.service.ts:233](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/payments.service.ts#L233)

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
