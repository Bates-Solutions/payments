[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquarePaymentError

# Class: SquarePaymentError

Defined in: [squareup/src/core/errors.ts:84](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L84)

Payment processing errors

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquarePaymentError**(`message`, `code`, `paymentId?`): `SquarePaymentError`

Defined in: [squareup/src/core/errors.ts:87](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L87)

#### Parameters

##### message

`string`

##### code

[`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

##### paymentId?

`string`

#### Returns

`SquarePaymentError`

#### Overrides

[`SquareError`](SquareError.md).[`constructor`](SquareError.md#constructor)

## Properties

### code

> `readonly` **code**: [`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L32)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### paymentId?

> `readonly` `optional` **paymentId?**: `string`

Defined in: [squareup/src/core/errors.ts:85](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L85)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L30)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)

## Methods

### notHasInstance()

> `static` **notHasInstance**(`value`): `boolean`

Defined in: [payments-core/dist/errors/payments-error.d.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L43)

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

[`SquareError`](SquareError.md).[`notHasInstance`](SquareError.md#nothasinstance)
