[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverValidationError

# Class: CloverValidationError

Defined in: [core/errors.ts:115](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L115)

Validation errors for input this wrapper checks before calling Clover

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverValidationError**(`message`, `field?`): `CloverValidationError`

Defined in: [core/errors.ts:118](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L118)

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

### field?

> `readonly` `optional` **field?**: `string`

Defined in: [core/errors.ts:116](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L116)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L24)

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
