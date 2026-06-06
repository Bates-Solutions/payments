[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareError

# Class: SquareError

Defined in: [core/errors.ts:30](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L30)

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

> **new SquareError**(`message`, `code?`, `statusCode?`, `details?`): `SquareError`

Defined in: [core/errors.ts:35](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L35)

#### Parameters

##### message

`string`

##### code?

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

Defined in: [core/errors.ts:31](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L31)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [core/errors.ts:33](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L33)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:32](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L32)
