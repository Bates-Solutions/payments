[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareError

# Class: SquareError

Defined in: [squareup/src/core/errors.ts:36](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L36)

Base Square error class. It extends core's `PaymentsError`, so
`error instanceof PaymentsError` catches any provider's error, as long as the
providers resolve the same copy of `@bates-solutions/payments-core`.

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

Defined in: [payments-core/src/errors/payments-error.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L30)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`code`](PaymentsError.md#code-1)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L34)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L32)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
