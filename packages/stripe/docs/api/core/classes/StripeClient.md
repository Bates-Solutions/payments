[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClient

# Class: StripeClient

Defined in: [core/client.ts:52](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L52)

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

Defined in: [core/client.ts:65](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L65)

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

Defined in: [core/client.ts:57](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L57)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [core/client.ts:56](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L56)

***

### prices

> `readonly` **prices**: [`PricesService`](PricesService.md)

Defined in: [core/client.ts:62](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L62)

***

### products

> `readonly` **products**: [`ProductsService`](ProductsService.md)

Defined in: [core/client.ts:63](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L63)

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

Defined in: [core/client.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L58)

***

### subscriptions

> `readonly` **subscriptions**: [`SubscriptionsService`](SubscriptionsService.md)

Defined in: [core/client.ts:61](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L61)

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

Defined in: [core/client.ts:104](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L104)

The environment this client operates in, derived from the API key.

##### Returns

[`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

***

### sdk

#### Get Signature

> **get** **sdk**(): `Stripe`

Defined in: [core/client.ts:97](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L97)

Get the underlying Stripe SDK client.
Use this for advanced operations not covered by the wrapper.

##### Returns

`Stripe`
