[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareAuthError

# Class: SquareAuthError

Defined in: [squareup/src/core/errors.ts:77](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L77)

Authentication errors

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquareAuthError**(`message`, `code?`): `SquareAuthError`

Defined in: [squareup/src/core/errors.ts:78](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L78)

#### Parameters

##### message

`string`

##### code?

[`SquareErrorCode`](../type-aliases/SquareErrorCode.md) = `'UNAUTHORIZED'`

#### Returns

`SquareAuthError`

#### Overrides

[`SquareError`](SquareError.md).[`constructor`](SquareError.md#constructor)

## Properties

### code

> `readonly` **code**: [`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

Defined in: [payments-core/src/errors/payments-error.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L38)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L42)

The raw error body or other context, if any.

#### Inherited from

[`SquareError`](SquareError.md).[`details`](SquareError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L40)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`SquareError`](SquareError.md).[`statusCode`](SquareError.md#statuscode)

## Methods

### \[hasInstance\]()

> `static` **\[hasInstance\]**(`value`): `boolean`

Defined in: [payments-core/src/errors/payments-error.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L60)

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

[`SquareError`](SquareError.md).[`[hasInstance]`](SquareError.md#hasinstance)
