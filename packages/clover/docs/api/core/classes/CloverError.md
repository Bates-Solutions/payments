[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverError

# Class: CloverError

Defined in: core/errors.ts:22

Base Clover error class

## Extends

- `Error`

## Extended by

- [`CloverApiError`](CloverApiError.md)
- [`CloverAuthError`](CloverAuthError.md)
- [`CloverPaymentError`](CloverPaymentError.md)
- [`CloverValidationError`](CloverValidationError.md)

## Constructors

### Constructor

> **new CloverError**(`message`, `code?`, `statusCode?`, `details?`): `CloverError`

Defined in: core/errors.ts:27

#### Parameters

##### message

`string`

##### code?

[`CloverErrorCode`](../type-aliases/CloverErrorCode.md) = `'UNKNOWN'`

##### statusCode?

`number`

##### details?

`unknown`

#### Returns

`CloverError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: core/errors.ts:23

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: core/errors.ts:25

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:24
