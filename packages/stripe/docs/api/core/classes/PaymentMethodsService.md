[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaymentMethodsService

# Class: PaymentMethodsService

Defined in: [stripe/src/core/services/payment-methods.service.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/payment-methods.service.ts#L43)

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

Defined in: [stripe/src/core/services/payment-methods.service.ts:44](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/payment-methods.service.ts#L44)

#### Parameters

##### client

`Stripe`

#### Returns

`PaymentMethodsService`

## Methods

### attach()

> **attach**(`paymentMethodId`, `options`): `Promise`\<`PaymentMethod`\>

Defined in: [stripe/src/core/services/payment-methods.service.ts:90](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/payment-methods.service.ts#L90)

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

Defined in: [stripe/src/core/services/payment-methods.service.ts:113](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/payment-methods.service.ts#L113)

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

Defined in: [stripe/src/core/services/payment-methods.service.ts:51](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/payment-methods.service.ts#L51)

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

Defined in: [stripe/src/core/services/payment-methods.service.ts:63](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/payment-methods.service.ts#L63)

List payment methods with cursor-based pagination.

#### Parameters

##### options?

[`ListPaymentMethodsOptions`](../interfaces/ListPaymentMethodsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`PaymentMethod`\>\>

***

### setDefault()

> **setDefault**(`customerId`, `paymentMethodId`, `options?`): `Promise`\<`Customer`\>

Defined in: [stripe/src/core/services/payment-methods.service.ts:137](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/payment-methods.service.ts#L137)

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
