[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverPaymentError

# Class: CloverPaymentError

Defined in: core/errors.ts:78

Payment processing errors (card declines, etc.)

## Extends

- [`CloverError`](CloverError.md)

## Constructors

### Constructor

> **new CloverPaymentError**(`message`, `code?`, `options?`): `CloverPaymentError`

Defined in: core/errors.ts:82

#### Parameters

##### message

`string`

##### code?

[`CloverErrorCode`](../type-aliases/CloverErrorCode.md) = `'CARD_DECLINED'`

##### options?

###### chargeId?

`string`

###### declineCode?

`string`

#### Returns

`CloverPaymentError`

#### Overrides

[`CloverError`](CloverError.md).[`constructor`](CloverError.md#constructor)

## Properties

### chargeId?

> `readonly` `optional` **chargeId?**: `string`

Defined in: core/errors.ts:79

***

### code

> `readonly` **code**: [`CloverErrorCode`](../type-aliases/CloverErrorCode.md)

Defined in: core/errors.ts:23

#### Inherited from

[`CloverError`](CloverError.md).[`code`](CloverError.md#code)

***

### declineCode?

> `readonly` `optional` **declineCode?**: `string`

Defined in: core/errors.ts:80

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: core/errors.ts:25

#### Inherited from

[`CloverError`](CloverError.md).[`details`](CloverError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: core/errors.ts:24

#### Inherited from

[`CloverError`](CloverError.md).[`statusCode`](CloverError.md#statuscode)
