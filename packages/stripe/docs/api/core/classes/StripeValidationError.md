[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeValidationError

# Class: StripeValidationError

Defined in: core/errors.ts:107

Validation errors for input this wrapper checks before calling Stripe

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeValidationError**(`message`, `field?`): `StripeValidationError`

Defined in: core/errors.ts:110

#### Parameters

##### message

`string`

##### field?

`string`

#### Returns

`StripeValidationError`

#### Overrides

[`StripeError`](StripeError.md).[`constructor`](StripeError.md#constructor)

## Properties

### code

> `readonly` **code**: [`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

Defined in: core/errors.ts:28

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: core/errors.ts:30

#### Inherited from

[`StripeError`](StripeError.md).[`details`](StripeError.md#details)

***

### field?

> `readonly` `optional` **field?**: `string`

Defined in: core/errors.ts:108

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:29

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)
