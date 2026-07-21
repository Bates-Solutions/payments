[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeApiError

# Class: StripeApiError

Defined in: core/errors.ts:52

API-level errors from Stripe

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeApiError**(`message`, `code`, `statusCode`, `options?`): `StripeApiError`

Defined in: core/errors.ts:60

#### Parameters

##### message

`string`

##### code

[`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

##### statusCode

`number`

##### options?

###### details?

`unknown`

###### param?

`string`

###### requestId?

`string`

###### type?

`string`

#### Returns

`StripeApiError`

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

### param?

> `readonly` `optional` **param?**: `string`

Defined in: core/errors.ts:56

Request parameter the error relates to, if any

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: core/errors.ts:58

Stripe request ID for support/debugging

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:29

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: core/errors.ts:54

Raw Stripe error `type` (e.g. `invalid_request_error`)
