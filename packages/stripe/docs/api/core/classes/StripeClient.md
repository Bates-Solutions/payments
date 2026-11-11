[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClient

# Class: StripeClient

Defined in: [core/client.ts:53](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L53)

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

Defined in: [core/client.ts:67](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L67)

#### Parameters

##### config

[`StripeClientConfig`](../interfaces/StripeClientConfig.md)

#### Returns

`StripeClient`

## Properties

### billingPortal

> `readonly` **billingPortal**: [`BillingPortalService`](BillingPortalService.md)

Defined in: [core/client.ts:61](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L61)

***

### checkout

> `readonly` **checkout**: [`CheckoutService`](CheckoutService.md)

Defined in: [core/client.ts:60](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L60)

***

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

Defined in: [core/client.ts:58](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L58)

***

### invoices

> `readonly` **invoices**: [`InvoicesService`](InvoicesService.md)

Defined in: [core/client.ts:65](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L65)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [core/client.ts:57](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L57)

***

### prices

> `readonly` **prices**: [`PricesService`](PricesService.md)

Defined in: [core/client.ts:63](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L63)

***

### products

> `readonly` **products**: [`ProductsService`](ProductsService.md)

Defined in: [core/client.ts:64](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L64)

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

Defined in: [core/client.ts:59](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L59)

***

### subscriptions

> `readonly` **subscriptions**: [`SubscriptionsService`](SubscriptionsService.md)

Defined in: [core/client.ts:62](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L62)

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

Defined in: [core/client.ts:109](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L109)

The environment this client operates in, derived from the API key.

##### Returns

[`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

***

### sdk

#### Get Signature

> **get** **sdk**(): `Stripe`

Defined in: [core/client.ts:102](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/client.ts#L102)

Get the underlying Stripe SDK client.
Use this for advanced operations not covered by the wrapper.

##### Returns

`Stripe`
