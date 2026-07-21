[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeAuthError

# Class: StripeAuthError

<<<<<<< HEAD
Defined in: [core/errors.ts:77](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L77)
=======
Defined in: [core/errors.ts:77](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L77)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Authentication errors

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeAuthError**(`message`, `code?`): `StripeAuthError`

<<<<<<< HEAD
Defined in: [core/errors.ts:78](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L78)
=======
Defined in: [core/errors.ts:78](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L78)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Parameters

##### message

`string`

##### code?

[`StripeErrorCode`](../type-aliases/StripeErrorCode.md) = `'UNAUTHORIZED'`

#### Returns

`StripeAuthError`

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

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

<<<<<<< HEAD
Defined in: [core/errors.ts:29](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/errors.ts#L29)
=======
Defined in: [core/errors.ts:29](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/errors.ts#L29)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)
