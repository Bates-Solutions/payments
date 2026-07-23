[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverApiError

# Class: CloverApiError

Defined in: core/errors.ts:46

API-level errors returned by Clover

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverApiError**(`message`, `code`, `statusCode`, `options?`): `CloverApiError`

Defined in: core/errors.ts:52

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

Defined in: core/errors.ts:48

Raw Clover error code, when present

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: core/errors.ts:23

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: core/errors.ts:25

#### Inherited from

[`CloverError`](CloverError.md).[`details`](CloverError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: core/errors.ts:50

Clover request id for support/debugging

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:24

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
