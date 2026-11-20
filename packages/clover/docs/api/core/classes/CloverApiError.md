[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverApiError

# Class: CloverApiError

Defined in: [clover/src/core/errors.ts:41](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L41)

API-level errors returned by Clover

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverApiError**(`message`, `code`, `statusCode`, `options?`): `CloverApiError`

Defined in: [clover/src/core/errors.ts:47](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L47)

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

Defined in: [clover/src/core/errors.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L43)

Raw Clover error code, when present

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [payments-core/src/errors/payments-error.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L38)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L42)

The raw error body or other context, if any.

#### Inherited from

[`CloverError`](CloverError.md).[`details`](CloverError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [clover/src/core/errors.ts:45](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L45)

Clover request id for support/debugging

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L40)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)

## Methods

### \[hasInstance\]()

> `static` **\[hasInstance\]**(`value`): `boolean`

Defined in: [payments-core/src/errors/payments-error.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L60)

Makes `value instanceof PaymentsError` true for an error from any copy of
this package, not only this one. It looks for a brand that every copy puts
on `PaymentsError.prototype`, so the prototype itself is not counted as an
instance. On a subclass, such as `SquareError`, it is the usual
prototype-chain check.

It returns a plain `boolean` rather than a type predicate, so TypeScript
keeps narrowing `instanceof SquareError` to `SquareError`.

#### Parameters

##### value

`unknown`

#### Returns

`boolean`

#### Inherited from

[`CloverError`](CloverError.md).[`[hasInstance]`](CloverError.md#hasinstance)
