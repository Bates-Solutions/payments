[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripePaymentError

# Class: StripePaymentError

<<<<<<< HEAD
Defined in: [core/errors.ts:87](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L87)
=======
Defined in: [core/errors.ts:87](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L87)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Payment processing errors (card declines, etc.)

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripePaymentError**(`message`, `code`, `options?`): `StripePaymentError`

<<<<<<< HEAD
Defined in: [core/errors.ts:92](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L92)
=======
Defined in: [core/errors.ts:92](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L92)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Parameters

##### message

`string`

##### code

[`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

##### options?

###### declineCode?

`string`

###### paymentIntentId?

`string`

#### Returns

`StripePaymentError`

#### Overrides

[`StripeError`](StripeError.md).[`constructor`](StripeError.md#constructor)

## Properties

### code

> `readonly` **code**: [`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

<<<<<<< HEAD
Defined in: [core/errors.ts:28](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L28)
=======
Defined in: [core/errors.ts:28](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L28)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### declineCode?

> `readonly` `optional` **declineCode?**: `string`

<<<<<<< HEAD
Defined in: [core/errors.ts:90](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L90)
=======
Defined in: [core/errors.ts:90](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L90)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Stripe decline code (e.g. `insufficient_funds`), when present

***

### details?

> `readonly` `optional` **details?**: `unknown`

<<<<<<< HEAD
Defined in: [core/errors.ts:30](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L30)
=======
Defined in: [core/errors.ts:30](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L30)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Inherited from

[`StripeError`](StripeError.md).[`details`](StripeError.md#details)

***

### paymentIntentId?

> `readonly` `optional` **paymentIntentId?**: `string`

<<<<<<< HEAD
Defined in: [core/errors.ts:88](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L88)
=======
Defined in: [core/errors.ts:88](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L88)
>>>>>>> feat/edge-webhook-and-subscription-helpers

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

<<<<<<< HEAD
Defined in: [core/errors.ts:29](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L29)
=======
Defined in: [core/errors.ts:29](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L29)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)
