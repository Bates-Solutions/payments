[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeError

# Class: StripeError

Defined in: [stripe/src/core/errors.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L32)

Base Stripe error class. It extends core's `PaymentsError`, so
`error instanceof PaymentsError` catches any provider's error, even when the
providers install different copies of `@bates-solutions/payments-core`.

## Extends

- [`PaymentsError`](PaymentsError.md)\<[`StripeErrorCode`](../type-aliases/StripeErrorCode.md)\>

## Extended by

- [`StripeApiError`](StripeApiError.md)
- [`StripeAuthError`](StripeAuthError.md)
- [`StripePaymentError`](StripePaymentError.md)
- [`StripeValidationError`](StripeValidationError.md)

## Constructors

### Constructor

> **new StripeError**(`message`, `code?`, `statusCode?`, `details?`): `StripeError`

Defined in: [stripe/src/core/errors.ts:33](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L33)

#### Parameters

##### message

`string`

##### code?

[`StripeErrorCode`](../type-aliases/StripeErrorCode.md) = `'UNKNOWN'`

##### statusCode?

`number`

##### details?

`unknown`

#### Returns

`StripeError`

#### Overrides

[`PaymentsError`](PaymentsError.md).[`constructor`](PaymentsError.md#constructor)

## Properties

### code

> `readonly` **code**: [`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

Defined in: [payments-core/src/errors/payments-error.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L38)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`code`](PaymentsError.md#code-1)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L42)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/src/errors/payments-error.ts#L40)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)

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

[`PaymentsError`](PaymentsError.md).[`[hasInstance]`](PaymentsError.md#hasinstance)
