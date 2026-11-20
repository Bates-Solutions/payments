[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeApiError

# Class: StripeApiError

Defined in: [stripe/src/core/errors.ts:46](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L46)

API-level errors from Stripe

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeApiError**(`message`, `code`, `statusCode`, `options?`): `StripeApiError`

Defined in: [stripe/src/core/errors.ts:54](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L54)

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

Defined in: [payments-core/src/errors/payments-error.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L38)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L42)

The raw error body or other context, if any.

#### Inherited from

[`StripeError`](StripeError.md).[`details`](StripeError.md#details)

***

### param?

> `readonly` `optional` **param?**: `string`

Defined in: [stripe/src/core/errors.ts:50](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L50)

Request parameter the error relates to, if any

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [stripe/src/core/errors.ts:52](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L52)

Stripe request ID for support/debugging

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L40)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`StripeError`](StripeError.md).[`statusCode`](StripeError.md#statuscode)

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [stripe/src/core/errors.ts:48](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L48)

Raw Stripe error `type` (e.g. `invalid_request_error`)

## Methods

### \[hasInstance\]()

> `static` **\[hasInstance\]**(`value`): `boolean`

Defined in: [payments-core/src/errors/payments-error.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L60)

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

[`StripeError`](StripeError.md).[`[hasInstance]`](StripeError.md#hasinstance)
