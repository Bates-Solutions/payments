[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverApiError

# Class: CloverApiError

Defined in: [clover/src/core/errors.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L40)

API-level errors returned by Clover

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverApiError**(`message`, `code`, `statusCode`, `options?`): `CloverApiError`

Defined in: [clover/src/core/errors.ts:46](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L46)

#### Parameters

##### message

`string`

##### code

[`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

##### statusCode

`number`

##### options?

###### cloverCode?

`string`

###### details?

`unknown`

###### requestId?

`string`

#### Returns

`CloverApiError`

#### Overrides

[`CloverError`](CloverError.md).[`constructor`](CloverError.md#constructor)

## Properties

### cloverCode?

> `readonly` `optional` **cloverCode?**: `string`

Defined in: [clover/src/core/errors.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L42)

Raw Clover error code, when present

***

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

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [clover/src/core/errors.ts:44](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L44)

Clover request id for support/debugging

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L26)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
