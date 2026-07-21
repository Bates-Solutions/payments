[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeAuthError

# Class: StripeAuthError

Defined in: [core/errors.ts:77](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/errors.ts#L77)

Authentication errors

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeAuthError**(`message`, `code?`): `StripeAuthError`

Defined in: [core/errors.ts:78](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/errors.ts#L78)

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

Defined in: [core/errors.ts:28](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/errors.ts#L28)

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [core/errors.ts:30](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/errors.ts#L30)

#### Inherited from

[`StripeError`](StripeError.md).[`details`](StripeError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:29](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/errors.ts#L29)

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)
