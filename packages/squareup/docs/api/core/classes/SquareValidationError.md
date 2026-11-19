[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareValidationError

# Class: SquareValidationError

Defined in: [squareup/src/core/errors.ts:96](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L96)

Validation errors

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquareValidationError**(`message`, `field?`): `SquareValidationError`

Defined in: [squareup/src/core/errors.ts:99](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L99)

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

Defined in: [payments-core/dist/errors/payments-error.d.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L24)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### field?

> `readonly` `optional` **field?**: `string`

Defined in: [squareup/src/core/errors.ts:97](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L97)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L26)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
