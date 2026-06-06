[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareValidationError

# Class: SquareValidationError

Defined in: [core/errors.ts:101](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L101)

Validation errors

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquareValidationError**(`message`, `field?`): `SquareValidationError`

Defined in: [core/errors.ts:104](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L104)

#### Parameters

##### message

`string`

##### field?

`string`

#### Returns

`SquareValidationError`

#### Overrides

[`SquareError`](SquareError.md).[`constructor`](SquareError.md#constructor)

## Properties

### code

> `readonly` **code**: [`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

Defined in: [core/errors.ts:31](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L31)

#### Inherited from

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [core/errors.ts:33](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L33)

#### Inherited from

[`SquareError`](SquareError.md).[`details`](SquareError.md#details)

***

### field?

> `readonly` `optional` **field?**: `string`

Defined in: [core/errors.ts:102](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L102)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:32](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/errors.ts#L32)

#### Inherited from

[`SquareError`](SquareError.md).[`statusCode`](SquareError.md#statuscode)
