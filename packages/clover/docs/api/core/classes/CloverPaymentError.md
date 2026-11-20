[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverPaymentError

# Class: CloverPaymentError

Defined in: [clover/src/core/errors.ts:85](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L85)

Payment processing errors (card declines, etc.)

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverPaymentError**(`message`, `code?`, `options?`): `CloverPaymentError`

Defined in: [clover/src/core/errors.ts:93](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L93)

#### Parameters

##### message

`string`

##### code?

[`CloverErrorCode`](../type-aliases/CloverErrorCode.md) = `'CARD_DECLINED'`

##### options?

###### chargeId?

`string`

###### cloverCode?

`string`

###### declineCode?

`string`

###### requestId?

`string`

#### Returns

`CloverPaymentError`

#### Overrides

[`CloverError`](CloverError.md).[`constructor`](CloverError.md#constructor)

## Properties

### chargeId?

> `readonly` `optional` **chargeId?**: `string`

Defined in: [clover/src/core/errors.ts:86](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L86)

***

### cloverCode?

> `readonly` `optional` **cloverCode?**: `string`

Defined in: [clover/src/core/errors.ts:89](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L89)

Clover's own error code, when present

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### declineCode?

> `readonly` `optional` **declineCode?**: `string`

Defined in: [clover/src/core/errors.ts:87](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L87)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L32)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [clover/src/core/errors.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L91)

Request id for tracing with Clover support

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L30)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)

## Methods

### notHasInstance()

> `static` **notHasInstance**(`value`): `boolean`

Defined in: [payments-core/dist/errors/payments-error.d.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L43)

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

[`CloverError`](CloverError.md).[`notHasInstance`](CloverError.md#nothasinstance)
