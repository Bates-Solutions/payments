[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverAuthError

# Class: CloverAuthError

Defined in: [clover/src/core/errors.ts:63](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L63)

Authentication / authorization errors (401 / 403)

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverAuthError**(`message`, `statusCode?`, `code?`, `options?`): `CloverAuthError`

Defined in: [clover/src/core/errors.ts:69](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L69)

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

Defined in: [clover/src/core/errors.ts:65](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L65)

Clover's own error code, when present

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L32)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [clover/src/core/errors.ts:67](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L67)

Request id for tracing with Clover support

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L30)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)

## Methods

### \[hasInstance\]()

> `static` **\[hasInstance\]**(`value`): `boolean`

Defined in: [payments-core/dist/errors/payments-error.d.ts:33](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L33)

#### Parameters

##### value

`unknown`

#### Returns

`boolean`

#### Inherited from

[`CloverError`](CloverError.md).[`[hasInstance]`](CloverError.md#hasinstance)
