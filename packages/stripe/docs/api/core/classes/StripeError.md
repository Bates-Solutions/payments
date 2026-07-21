[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeError

# Class: StripeError

Defined in: core/errors.ts:27

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

Defined in: core/errors.ts:32

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

Defined in: core/errors.ts:28

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: core/errors.ts:30

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:29
