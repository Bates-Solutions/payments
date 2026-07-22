[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverAuthError

# Class: CloverAuthError

Defined in: core/errors.ts:68

Authentication / authorization errors (401 / 403)

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverAuthError**(`message`, `statusCode?`, `code?`): `CloverAuthError`

Defined in: core/errors.ts:69

#### Parameters

##### message

`string`

##### statusCode?

`number` = `401`

##### code?

[`CloverErrorCode`](../type-aliases/CloverErrorCode.md) = `'UNAUTHORIZED'`

#### Returns

`CloverAuthError`

#### Overrides

[`CloverError`](CloverError.md).[`constructor`](CloverError.md#constructor)

## Properties

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

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:24

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
