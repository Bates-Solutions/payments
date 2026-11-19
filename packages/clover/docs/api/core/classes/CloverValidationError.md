[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverValidationError

# Class: CloverValidationError

Defined in: [clover/src/core/errors.ts:109](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L109)

Validation errors for input this wrapper checks before calling Clover

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverValidationError**(`message`, `field?`): `CloverValidationError`

Defined in: [clover/src/core/errors.ts:112](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L112)

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

Defined in: [payments-core/dist/errors/payments-error.d.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L24)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### field?

> `readonly` `optional` **field?**: `string`

Defined in: [clover/src/core/errors.ts:110](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L110)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L26)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
