[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareApiError

# Class: SquareApiError

Defined in: [squareup/src/core/errors.ts:51](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L51)

API-level errors from Square

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquareApiError**(`message`, `code`, `statusCode`, `errors`): `SquareApiError`

Defined in: [squareup/src/core/errors.ts:59](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L59)

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

Defined in: [payments-core/src/errors/payments-error.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L30)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L34)

The raw error body or other context, if any.

#### Inherited from

[`SquareError`](SquareError.md).[`details`](SquareError.md#details)

***

### errors

> `readonly` **errors**: `object`[]

Defined in: [squareup/src/core/errors.ts:52](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L52)

#### category

> **category**: `string`

#### code

> **code**: `string`

#### detail?

> `optional` **detail?**: `string`

#### field?

> `optional` **field?**: `string`

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L32)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`SquareError`](SquareError.md).[`statusCode`](SquareError.md#statuscode)
