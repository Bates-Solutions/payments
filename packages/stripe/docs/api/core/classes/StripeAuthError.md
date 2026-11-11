[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeAuthError

# Class: StripeAuthError

Defined in: [core/errors.ts:81](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L81)

Authentication errors

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeAuthError**(`message`, `code?`): `StripeAuthError`

Defined in: [core/errors.ts:82](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L82)

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

Defined in: [core/errors.ts:29](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L29)

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [core/errors.ts:31](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L31)

#### Inherited from

[`StripeError`](StripeError.md).[`details`](StripeError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:30](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L30)

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)
