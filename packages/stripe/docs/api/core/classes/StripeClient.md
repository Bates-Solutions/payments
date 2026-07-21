[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClient

# Class: StripeClient

<<<<<<< HEAD
Defined in: [core/client.ts:52](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L52)
=======
Defined in: [core/client.ts:47](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L47)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Main Stripe client wrapper.

## Example

```typescript
const stripe = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

// Create a payment
const payment = await stripe.payments.create({
  amount: 1000, // $10.00
  currency: 'usd',
  paymentMethod: 'pm_card_visa',
  confirm: true,
});
```

## Constructors

### Constructor

> **new StripeClient**(`config`): `StripeClient`

<<<<<<< HEAD
Defined in: [core/client.ts:65](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L65)
=======
Defined in: [core/client.ts:55](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L55)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Parameters

##### config

[`StripeClientConfig`](../interfaces/StripeClientConfig.md)

#### Returns

`StripeClient`

## Properties

### billingPortal

> `readonly` **billingPortal**: [`BillingPortalService`](BillingPortalService.md)

Defined in: [core/client.ts:60](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L60)

***

### checkout

> `readonly` **checkout**: [`CheckoutService`](CheckoutService.md)

Defined in: [core/client.ts:59](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L59)

***

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

<<<<<<< HEAD
Defined in: [core/client.ts:57](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L57)
=======
Defined in: [core/client.ts:52](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L52)
>>>>>>> feat/edge-webhook-and-subscription-helpers

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

<<<<<<< HEAD
Defined in: [core/client.ts:56](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L56)

***

### prices

> `readonly` **prices**: [`PricesService`](PricesService.md)

Defined in: [core/client.ts:62](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L62)

***

### products

> `readonly` **products**: [`ProductsService`](ProductsService.md)

Defined in: [core/client.ts:63](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L63)
=======
Defined in: [core/client.ts:51](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L51)
>>>>>>> feat/edge-webhook-and-subscription-helpers

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

<<<<<<< HEAD
Defined in: [core/client.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L58)

***

### subscriptions

> `readonly` **subscriptions**: [`SubscriptionsService`](SubscriptionsService.md)

Defined in: [core/client.ts:61](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L61)
=======
Defined in: [core/client.ts:53](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L53)
>>>>>>> feat/edge-webhook-and-subscription-helpers

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

<<<<<<< HEAD
Defined in: [core/client.ts:104](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L104)
=======
Defined in: [core/client.ts:91](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L91)
>>>>>>> feat/edge-webhook-and-subscription-helpers

The environment this client operates in, derived from the API key.

##### Returns

[`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

***

### sdk

#### Get Signature

> **get** **sdk**(): `Stripe`

<<<<<<< HEAD
Defined in: [core/client.ts:97](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L97)
=======
Defined in: [core/client.ts:84](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L84)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Get the underlying Stripe SDK client.
Use this for advanced operations not covered by the wrapper.

##### Returns

`Stripe`
