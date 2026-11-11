[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverAuthError

# Class: CloverAuthError

Defined in: [core/errors.ts:68](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L68)

Authentication / authorization errors (401 / 403)

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverAuthError**(`message`, `statusCode?`, `code?`, `options?`): `CloverAuthError`

Defined in: [core/errors.ts:74](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L74)

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

Defined in: [core/errors.ts:70](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L70)

Clover's own error code, when present

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [core/errors.ts:23](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L23)

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [core/errors.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L25)

#### Inherited from

[`CloverError`](CloverError.md).[`details`](CloverError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [core/errors.ts:72](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L72)

Request id for tracing with Clover support

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L24)

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
