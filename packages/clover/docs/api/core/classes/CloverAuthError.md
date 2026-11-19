[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverAuthError

# Class: CloverAuthError

Defined in: [clover/src/core/errors.ts:62](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L62)

Authentication / authorization errors (401 / 403)

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverAuthError**(`message`, `statusCode?`, `code?`, `options?`): `CloverAuthError`

Defined in: [clover/src/core/errors.ts:68](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L68)

#### Parameters

##### message

`string`

##### statusCode?

`number` = `401`

##### code?

[`CloverErrorCode`](../type-aliases/CloverErrorCode.md) = `'UNAUTHORIZED'`

##### options?

###### cloverCode?

`string`

###### requestId?

`string`

#### Returns

`CloverAuthError`

#### Overrides

[`CloverError`](CloverError.md).[`constructor`](CloverError.md#constructor)

## Properties

### cloverCode?

> `readonly` `optional` **cloverCode?**: `string`

Defined in: [clover/src/core/errors.ts:64](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L64)

Clover's own error code, when present

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [payments-core/dist/errors/payments-error.d.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L27)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:31](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L31)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [clover/src/core/errors.ts:66](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L66)

Request id for tracing with Clover support

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L29)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
