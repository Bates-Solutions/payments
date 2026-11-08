[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverValidationError

# Class: CloverValidationError

Defined in: core/errors.ts:97

Validation errors for input this wrapper checks before calling Clover

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverValidationError**(`message`, `field?`): `CloverValidationError`

Defined in: core/errors.ts:100

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

### field?

> `readonly` `optional` **field?**: `string`

Defined in: core/errors.ts:98

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:24

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
