[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClient

# Class: StripeClient

Defined in: [core/client.ts:47](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/client.ts#L47)

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

Defined in: [core/client.ts:55](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/client.ts#L55)

#### Parameters

##### config

[`StripeClientConfig`](../interfaces/StripeClientConfig.md)

#### Returns

`StripeClient`

## Properties

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

Defined in: [core/client.ts:52](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/client.ts#L52)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [core/client.ts:51](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/client.ts#L51)

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

Defined in: [core/client.ts:53](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/client.ts#L53)

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

Defined in: [core/client.ts:89](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/client.ts#L89)

The environment this client operates in, derived from the API key.

##### Returns

[`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

***

### sdk

#### Get Signature

> **get** **sdk**(): `Stripe`

Defined in: [core/client.ts:82](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/client.ts#L82)

Get the underlying Stripe SDK client.
Use this for advanced operations not covered by the wrapper.

##### Returns

`Stripe`
