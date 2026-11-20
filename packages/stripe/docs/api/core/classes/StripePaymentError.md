[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripePaymentError

# Class: StripePaymentError

Defined in: [stripe/src/core/errors.ts:81](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L81)

Payment processing errors (card declines, etc.)

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripePaymentError**(`message`, `code`, `options?`): `StripePaymentError`

Defined in: [stripe/src/core/errors.ts:86](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L86)

#### Parameters

##### message

`string`

##### code

[`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

##### options?

###### declineCode?

`string`

###### paymentIntentId?

`string`

#### Returns

`StripePaymentError`

#### Overrides

[`StripeError`](StripeError.md).[`constructor`](StripeError.md#constructor)

## Properties

### code

> `readonly` **code**: [`StripeErrorCode`](../type-aliases/StripeErrorCode.md)

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### declineCode?

> `readonly` `optional` **declineCode?**: `string`

Defined in: [stripe/src/core/errors.ts:84](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L84)

Stripe decline code (e.g. `insufficient_funds`), when present

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/dist/errors/payments-error.d.ts#L32)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### paymentIntentId?

> `readonly` `optional` **paymentIntentId?**: `string`

Defined in: [stripe/src/core/errors.ts:82](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L82)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/dist/errors/payments-error.d.ts#L30)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)

## Methods

### notHasInstance()

> `static` **notHasInstance**(`value`): `boolean`

Defined in: [payments-core/dist/errors/payments-error.d.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/dist/errors/payments-error.d.ts#L43)

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

[`StripeError`](StripeError.md).[`notHasInstance`](StripeError.md#nothasinstance)
