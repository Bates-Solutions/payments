[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaymentMethodsService

# Class: PaymentMethodsService

Defined in: [core/services/payment-methods.service.ts:44](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L44)

Payment Methods service wrapping Stripe
[PaymentMethods](https://docs.stripe.com/api/payment_methods): read, attach
to and detach from customers, and set a customer's default.

To save a card for later (off-session) charges, collect it with a
SetupIntent (see `setupIntents`); Stripe attaches it to the customer when the
SetupIntent succeeds.

## Example

```typescript
const { data: cards } = await stripe.paymentMethods.list({ customerId: 'cus_123', type: 'card' });
await stripe.paymentMethods.setDefault('cus_123', cards[0].id);
```

## Constructors

### Constructor

> **new PaymentMethodsService**(`client`): `PaymentMethodsService`

Defined in: [core/services/payment-methods.service.ts:45](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L45)

#### Parameters

##### client

`Stripe`

#### Returns

`PaymentMethodsService`

## Methods

### attach()

> **attach**(`paymentMethodId`, `options`): `Promise`\<`PaymentMethod`\>

Defined in: [core/services/payment-methods.service.ts:91](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L91)

Attach a payment method to a customer.

Prefer a SetupIntent for cards you will charge off-session: attaching
directly skips the authentication and mandate a SetupIntent collects.

#### Parameters

##### paymentMethodId

`string`

##### options

###### customerId

`string`

###### idempotencyKey?

`string`

#### Returns

`Promise`\<`PaymentMethod`\>

#### Throws

When `paymentMethodId` or `customerId` is missing

***

### detach()

> **detach**(`paymentMethodId`, `options?`): `Promise`\<`PaymentMethod`\>

Defined in: [core/services/payment-methods.service.ts:114](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L114)

Detach a payment method from its customer. It can't be used again
afterwards.

#### Parameters

##### paymentMethodId

`string`

##### options?

###### idempotencyKey?

`string`

#### Returns

`Promise`\<`PaymentMethod`\>

#### Throws

When `paymentMethodId` is missing

***

### get()

> **get**(`paymentMethodId`): `Promise`\<`PaymentMethod`\>

Defined in: [core/services/payment-methods.service.ts:52](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L52)

Retrieve a payment method by ID.

#### Parameters

##### paymentMethodId

`string`

#### Returns

`Promise`\<`PaymentMethod`\>

#### Throws

When `paymentMethodId` is missing

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`PaymentMethod`\>\>

Defined in: [core/services/payment-methods.service.ts:64](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L64)

List payment methods with cursor-based pagination.

#### Parameters

##### options?

[`ListPaymentMethodsOptions`](../interfaces/ListPaymentMethodsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`PaymentMethod`\>\>

***

### setDefault()

> **setDefault**(`customerId`, `paymentMethodId`, `options?`): `Promise`\<`Customer`\>

Defined in: [core/services/payment-methods.service.ts:138](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L138)

Make a payment method the customer's default for invoices and
subscriptions (`invoice_settings.default_payment_method`). The payment
method must already be attached to the customer.

#### Parameters

##### customerId

`string`

##### paymentMethodId

`string`

##### options?

###### idempotencyKey?

`string`

#### Returns

`Promise`\<`Customer`\>

The updated customer

#### Throws

When `customerId` or `paymentMethodId` is missing
