[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverError

# Class: CloverError

Defined in: [clover/src/core/errors.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L26)

Base Clover error class. It extends core's `PaymentsError`, so
`error instanceof PaymentsError` catches any provider's error, even when the
providers install different copies of `@bates-solutions/payments-core`.

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

Defined in: [clover/src/core/errors.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L27)

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

Defined in: [payments-core/src/errors/payments-error.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L38)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`code`](PaymentsError.md#code-1)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L42)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L40)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)

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

[`PaymentsError`](PaymentsError.md).[`[hasInstance]`](PaymentsError.md#hasinstance)
