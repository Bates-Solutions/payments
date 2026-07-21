[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CheckoutService

# Class: CheckoutService

Defined in: core/services/checkout.service.ts:74

Checkout service wrapping Stripe [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions).

## Example

```typescript
const session = await stripe.checkout.create({
  mode: 'subscription',
  customerId: 'cus_123',
  lineItems: [{ price: 'price_123', quantity: 1 }],
  successUrl: 'https://app.example.com/billing?success=true',
  cancelUrl: 'https://app.example.com/billing?canceled=true',
});

redirect(session.url);
```

## Constructors

### Constructor

> **new CheckoutService**(`client`): `CheckoutService`

Defined in: core/services/checkout.service.ts:75

#### Parameters

##### client

`Stripe`

#### Returns

`CheckoutService`

## Methods

### create()

> **create**(`options`): `Promise`\<`Session`\>

Defined in: core/services/checkout.service.ts:85

Create a Checkout Session.

#### Parameters

##### options

[`CreateCheckoutSessionOptions`](../interfaces/CreateCheckoutSessionOptions.md)

Session creation options

#### Returns

`Promise`\<`Session`\>

The created session (use `session.url` to redirect the customer)

#### Throws

When required fields are missing

***

### expire()

> **expire**(`sessionId`): `Promise`\<`Session`\>

Defined in: core/services/checkout.service.ts:133

Expire an open Checkout Session so it can no longer be completed.

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Session`\>

***

### get()

> **get**(`sessionId`): `Promise`\<`Session`\>

Defined in: core/services/checkout.service.ts:122

Retrieve a Checkout Session by ID.

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Session`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Session`\>\>

Defined in: core/services/checkout.service.ts:144

List Checkout Sessions with cursor-based pagination.

#### Parameters

##### options?

[`ListCheckoutSessionsOptions`](../interfaces/ListCheckoutSessionsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Session`\>\>
