[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClient

# Class: StripeClient

Defined in: [core/client.ts:47](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L47)

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

Defined in: [core/client.ts:55](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L55)

#### Parameters

##### config

[`StripeClientConfig`](../interfaces/StripeClientConfig.md)

#### Returns

`StripeClient`

## Properties

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

Defined in: [core/client.ts:52](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L52)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [core/client.ts:51](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L51)

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

Defined in: [core/client.ts:53](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L53)

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

Defined in: [core/client.ts:91](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L91)

The environment this client operates in, derived from the API key.

##### Returns

[`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

***

### sdk

#### Get Signature

> **get** **sdk**(): `Stripe`

Defined in: [core/client.ts:84](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L84)

Get the underlying Stripe SDK client.
Use this for advanced operations not covered by the wrapper.

##### Returns

`Stripe`
