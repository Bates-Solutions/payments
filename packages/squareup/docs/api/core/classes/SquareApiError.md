[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareApiError

# Class: SquareApiError

Defined in: [src/core/errors.ts:55](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L55)

API-level errors from Square

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquareApiError**(`message`, `code`, `statusCode`, `errors`): `SquareApiError`

Defined in: [src/core/errors.ts:63](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L63)

#### Parameters

##### message

`string`

##### code

[`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

##### statusCode

`number`

##### errors

`object`[]

#### Returns

`SquareApiError`

#### Overrides

[`SquareError`](SquareError.md).[`constructor`](SquareError.md#constructor)

## Properties

### code

> `readonly` **code**: [`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

Defined in: [src/core/errors.ts:31](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L31)

#### Inherited from

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details**: `unknown`

Defined in: [src/core/errors.ts:33](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L33)

#### Inherited from

[`SquareError`](SquareError.md).[`details`](SquareError.md#details)

***

### errors

> `readonly` **errors**: `object`[]

Defined in: [src/core/errors.ts:56](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L56)

#### category

> **category**: `string`

#### code

> **code**: `string`

#### detail?

> `optional` **detail**: `string`

#### field?

> `optional` **field**: `string`

***

### statusCode?

> `readonly` `optional` **statusCode**: `number`

Defined in: [src/core/errors.ts:32](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/errors.ts#L32)

#### Inherited from

[`SquareError`](SquareError.md).[`statusCode`](SquareError.md#statuscode)
