[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeApiError

# Class: StripeApiError

Defined in: [core/errors.ts:53](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L53)

API-level errors from Stripe

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeApiError**(`message`, `code`, `statusCode`, `options?`): `StripeApiError`

Defined in: [core/errors.ts:64](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L64)

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

### param?

> `readonly` `optional` **param?**: `string`

Defined in: [core/errors.ts:60](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L60)

Request parameter the error relates to, if any

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [core/errors.ts:62](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L62)

Stripe request ID for support/debugging

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:30](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L30)

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [core/errors.ts:58](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/errors.ts#L58)

The error type Stripe sent (e.g. `invalid_request_error`, or an OAuth
error such as `invalid_grant`). Use `code` for the classification.
