[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareError

# Class: SquareError

Defined in: [squareup/src/core/errors.ts:36](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L36)

Base Square error class. It extends core's `PaymentsError`, so
`error instanceof PaymentsError` catches any provider's error, even when the
providers install different copies of `@bates-solutions/payments-core`.

## Extends

- [`PaymentsError`](PaymentsError.md)\<[`SquareErrorCode`](../type-aliases/SquareErrorCode.md)\>

## Extended by

- [`SquareApiError`](SquareApiError.md)
- [`SquareAuthError`](SquareAuthError.md)
- [`SquarePaymentError`](SquarePaymentError.md)
- [`SquareValidationError`](SquareValidationError.md)
- [`SquareNetworkError`](SquareNetworkError.md)

## Constructors

### Constructor

> **new SquareError**(`message`, `code?`, `statusCode?`, `details?`): `SquareError`

Defined in: [squareup/src/core/errors.ts:37](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L37)

#### Parameters

##### message

`string`

##### code?

[`SquareErrorCode`](../type-aliases/SquareErrorCode.md) = `'UNKNOWN'`

##### statusCode?

`number`

##### details?

`unknown`

#### Returns

`SquareError`

#### Overrides

[`PaymentsError`](PaymentsError.md).[`constructor`](PaymentsError.md#constructor)

## Properties

### code

> `readonly` **code**: [`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

Defined in: [payments-core/src/errors/payments-error.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L38)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`code`](PaymentsError.md#code-1)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L42)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L40)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)

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

[`PaymentsError`](PaymentsError.md).[`[hasInstance]`](PaymentsError.md#hasinstance)
