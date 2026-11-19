[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverError

# Class: CloverError

Defined in: [clover/src/core/errors.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L25)

Base Clover error class. It extends core's `PaymentsError`, so
`error instanceof PaymentsError` catches any provider's error.

## Extends

- [`PaymentsError`](PaymentsError.md)\<[`CloverErrorCode`](../type-aliases/CloverErrorCode.md)\>

## Extended by

- [`CloverApiError`](CloverApiError.md)
- [`CloverAuthError`](CloverAuthError.md)
- [`CloverPaymentError`](CloverPaymentError.md)
- [`CloverValidationError`](CloverValidationError.md)

## Constructors

### Constructor

> **new CloverError**(`message`, `code?`, `statusCode?`, `details?`): `CloverError`

Defined in: [clover/src/core/errors.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L26)

#### Parameters

##### message

`string`

##### code?

[`CloverErrorCode`](../type-aliases/CloverErrorCode.md) = `'UNKNOWN'`

##### statusCode?

`number`

##### details?

`unknown`

#### Returns

`CloverError`

#### Overrides

[`PaymentsError`](PaymentsError.md).[`constructor`](PaymentsError.md#constructor)

## Properties

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [payments-core/dist/errors/payments-error.d.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L24)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`code`](PaymentsError.md#code-1)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L26)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
