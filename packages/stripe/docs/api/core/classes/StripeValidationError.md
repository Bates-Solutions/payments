[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeValidationError

# Class: StripeValidationError

<<<<<<< HEAD
Defined in: [core/errors.ts:107](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L107)
=======
Defined in: [core/errors.ts:107](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L107)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Validation errors for input this wrapper checks before calling Stripe

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeValidationError**(`message`, `field?`): `StripeValidationError`

<<<<<<< HEAD
Defined in: [core/errors.ts:110](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L110)
=======
Defined in: [core/errors.ts:110](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L110)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Parameters

##### message

`string`

##### field?

`string`

#### Returns

`StripeValidationError`

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

### field?

> `readonly` `optional` **field?**: `string`

<<<<<<< HEAD
Defined in: [core/errors.ts:108](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L108)
=======
Defined in: [core/errors.ts:108](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L108)
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
