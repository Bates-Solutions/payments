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

Defined in: [payments-core/src/errors/payments-error.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L30)

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

Defined in: [payments-core/src/errors/payments-error.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L34)

The raw error body or other context, if any.

#### Inherited from

[`CloverError`](CloverError.md).[`details`](CloverError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [clover/src/core/errors.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L91)

Request id for tracing with Clover support

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/src/errors/payments-error.ts#L32)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
