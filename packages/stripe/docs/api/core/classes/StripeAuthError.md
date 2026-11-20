[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeAuthError

# Class: StripeAuthError

Defined in: [stripe/src/core/errors.ts:71](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L71)

Authentication errors

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeAuthError**(`message`, `code?`): `StripeAuthError`

Defined in: [stripe/src/core/errors.ts:72](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L72)

#### Parameters

##### message

`string`

##### code?

[`StripeErrorCode`](../type-aliases/StripeErrorCode.md) = `'UNAUTHORIZED'`

#### Returns

`StripeAuthError`

#### Overrides

[`StripeError`](StripeError.md).[`constructor`](StripeError.md#constructor)

## Properties

### code

> `readonly` **code**: [`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

Defined in: [payments-core/src/errors/payments-error.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L30)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L34)

The raw error body or other context, if any.

#### Inherited from

[`StripeError`](StripeError.md).[`details`](StripeError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L32)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)
