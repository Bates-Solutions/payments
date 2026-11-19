[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeValidationError

# Class: StripeValidationError

Defined in: [stripe/src/core/errors.ts:101](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L101)

Validation errors for input this wrapper checks before calling Stripe

## Extends

- [`StripeError`](StripeError.md)

## Constructors

### Constructor

> **new StripeValidationError**(`message`, `field?`): `StripeValidationError`

Defined in: [stripe/src/core/errors.ts:104](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L104)

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

Defined in: [payments-core/dist/errors/payments-error.d.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/dist/errors/payments-error.d.ts#L27)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`StripeError`](StripeError.md).[`code`](StripeError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:31](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/dist/errors/payments-error.d.ts#L31)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### field?

> `readonly` `optional` **field?**: `string`

Defined in: [stripe/src/core/errors.ts:102](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L102)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/../../payments-core/dist/errors/payments-error.d.ts#L29)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
