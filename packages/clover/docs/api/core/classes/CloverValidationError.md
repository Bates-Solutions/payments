[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverValidationError

# Class: CloverValidationError

Defined in: [clover/src/core/errors.ts:110](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L110)

Validation errors for input this wrapper checks before calling Clover

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverValidationError**(`message`, `field?`): `CloverValidationError`

Defined in: [clover/src/core/errors.ts:113](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L113)

#### Parameters

##### message

`string`

##### field?

`string`

#### Returns

`CloverValidationError`

#### Overrides

[`CloverError`](CloverError.md).[`constructor`](CloverError.md#constructor)

## Properties

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [payments-core/src/errors/payments-error.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L30)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L34)

The raw error body or other context, if any.

#### Inherited from

[`CloverError`](CloverError.md).[`details`](CloverError.md#details)

***

### field?

> `readonly` `optional` **field?**: `string`

Defined in: [clover/src/core/errors.ts:111](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L111)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L32)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
