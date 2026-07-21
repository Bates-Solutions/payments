[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeError

# Class: StripeError

<<<<<<< HEAD
Defined in: [core/errors.ts:27](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L27)
=======
Defined in: [core/errors.ts:27](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L27)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Base Stripe error class

## Extends

- `Error`

## Extended by

- [`StripeApiError`](StripeApiError.md)
- [`StripeAuthError`](StripeAuthError.md)
- [`StripePaymentError`](StripePaymentError.md)
- [`StripeValidationError`](StripeValidationError.md)

## Constructors

### Constructor

> **new StripeError**(`message`, `code?`, `statusCode?`, `details?`): `StripeError`

<<<<<<< HEAD
Defined in: [core/errors.ts:32](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L32)
=======
Defined in: [core/errors.ts:32](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L32)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Parameters

##### message

`string`

##### code?

[`StripeErrorCode`](../type-aliases/StripeErrorCode.md) = `'UNKNOWN'`

##### statusCode?

`number`

##### details?

`unknown`

#### Returns

`StripeError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: [`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

<<<<<<< HEAD
Defined in: [core/errors.ts:28](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L28)
=======
Defined in: [core/errors.ts:28](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L28)
>>>>>>> feat/edge-webhook-and-subscription-helpers

***

### details?

> `readonly` `optional` **details?**: `unknown`

<<<<<<< HEAD
Defined in: [core/errors.ts:30](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L30)
=======
Defined in: [core/errors.ts:30](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L30)
>>>>>>> feat/edge-webhook-and-subscription-helpers

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

<<<<<<< HEAD
Defined in: [core/errors.ts:29](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L29)
=======
Defined in: [core/errors.ts:29](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L29)
>>>>>>> feat/edge-webhook-and-subscription-helpers
