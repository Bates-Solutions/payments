[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverPaymentError

# Class: CloverPaymentError

Defined in: [core/errors.ts:90](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L90)

Payment processing errors (card declines, etc.)

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverPaymentError**(`message`, `code?`, `options?`): `CloverPaymentError`

Defined in: [core/errors.ts:98](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L98)

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

Defined in: [core/errors.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L91)

***

### cloverCode?

> `readonly` `optional` **cloverCode?**: `string`

Defined in: [core/errors.ts:94](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L94)

Clover's own error code, when present

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: [core/errors.ts:23](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L23)

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### declineCode?

> `readonly` `optional` **declineCode?**: `string`

Defined in: [core/errors.ts:92](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L92)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [core/errors.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L25)

#### Inherited from

[`CloverError`](CloverError.md).[`details`](CloverError.md#details)

***

### requestId?

> `readonly` `optional` **requestId?**: `string`

Defined in: [core/errors.ts:96](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L96)

Request id for tracing with Clover support

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [core/errors.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/errors.ts#L24)

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
