[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeError

# Class: StripeError

Defined in: [core/errors.ts:28](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L28)

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

Defined in: [core/errors.ts:33](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L33)

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

Defined in: [core/errors.ts:29](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L29)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [core/errors.ts:31](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L31)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:30](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L30)
