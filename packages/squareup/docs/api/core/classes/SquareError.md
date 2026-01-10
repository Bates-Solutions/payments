[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareError

# Class: SquareError

Defined in: [src/core/errors.ts:30](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L30)

Base Square error class

## Extends

- `Error`

## Extended by

- [`SquareApiError`](SquareApiError.md)
- [`SquareAuthError`](SquareAuthError.md)
- [`SquarePaymentError`](SquarePaymentError.md)
- [`SquareValidationError`](SquareValidationError.md)

## Constructors

### Constructor

> **new SquareError**(`message`, `code`, `statusCode?`, `details?`): `SquareError`

Defined in: [src/core/errors.ts:35](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L35)

#### Parameters

##### message

`string`

##### code

[`SquareErrorCode`](../type-aliases/SquareErrorCode.md) = `'UNKNOWN'`

##### statusCode?

`number`

##### details?

`unknown`

#### Returns

`SquareError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: [`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

Defined in: [src/core/errors.ts:31](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L31)

***

### details?

> `readonly` `optional` **details**: `unknown`

Defined in: [src/core/errors.ts:33](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L33)

***

### statusCode?

> `readonly` `optional` **statusCode**: `number`

Defined in: [src/core/errors.ts:32](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L32)
