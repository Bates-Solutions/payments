[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClient

# Class: StripeClient

Defined in: [core/client.ts:88](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L88)

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

Defined in: [core/client.ts:109](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L109)

#### Parameters

##### config

[`StripeClientConfig`](../interfaces/StripeClientConfig.md)

#### Returns

`StripeClient`

## Properties

### billingPortal

> `readonly` **billingPortal**: [`BillingPortalService`](BillingPortalService.md)

Defined in: [core/client.ts:99](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L99)

***

### checkout

> `readonly` **checkout**: [`CheckoutService`](CheckoutService.md)

Defined in: [core/client.ts:98](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L98)

***

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

Defined in: [core/client.ts:96](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L96)

***

### invoices

> `readonly` **invoices**: [`InvoicesService`](InvoicesService.md)

Defined in: [core/client.ts:103](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L103)

***

### oauth

> `readonly` **oauth**: [`OAuthService`](OAuthService.md)

Defined in: [core/client.ts:107](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L107)

***

### paymentLinks

> `readonly` **paymentLinks**: [`PaymentLinksService`](PaymentLinksService.md)

Defined in: [core/client.ts:106](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L106)

***

### paymentMethods

> `readonly` **paymentMethods**: [`PaymentMethodsService`](PaymentMethodsService.md)

Defined in: [core/client.ts:104](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L104)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [core/client.ts:95](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L95)

***

### prices

> `readonly` **prices**: [`PricesService`](PricesService.md)

Defined in: [core/client.ts:101](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L101)

***

### products

> `readonly` **products**: [`ProductsService`](ProductsService.md)

Defined in: [core/client.ts:102](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L102)

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

Defined in: [core/client.ts:97](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L97)

***

### setupIntents

> `readonly` **setupIntents**: [`SetupIntentsService`](SetupIntentsService.md)

Defined in: [core/client.ts:105](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L105)

***

### subscriptions

> `readonly` **subscriptions**: [`SubscriptionsService`](SubscriptionsService.md)

Defined in: [core/client.ts:100](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L100)

## Accessors

### accountId

#### Get Signature

> **get** **accountId**(): `string` \| `undefined`

Defined in: [core/client.ts:177](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L177)

The connected account this client acts as, or `undefined` for the
platform account.

##### Returns

`string` \| `undefined`

***

### environment

#### Get Signature

> **get** **environment**(): [`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

Defined in: [core/client.ts:204](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L204)

The environment this client operates in, derived from the API key.

##### Returns

[`StripeEnvironment`](../type-aliases/StripeEnvironment.md)

***

### sdk

#### Get Signature

> **get** **sdk**(): `Stripe`

Defined in: [core/client.ts:197](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L197)

Get the underlying Stripe SDK client.
Use this for advanced operations not covered by the wrapper.

##### Returns

`Stripe`

## Methods

### forAccount()

> **forAccount**(`accountId`): `StripeClient`

Defined in: [core/client.ts:168](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L168)

Return a client that acts as a connected account. Every call it makes
sends `Stripe-Account: <accountId>`, so all services work unchanged on
that account. The original client is not modified.

#### Parameters

##### accountId

`string`

Connected account ID (`acct_…`), e.g. the
  `stripeUserId` from `oauth.exchangeCode`

#### Returns

`StripeClient`

#### Throws

When `accountId` is not an `acct_…` ID

#### Example

```typescript
const retailer = stripe.forAccount('acct_123');
const { data: products } = await retailer.products.list({ active: true });
```
