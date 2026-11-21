[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquarePaymentError

# Class: SquarePaymentError

Defined in: [squareup/src/core/errors.ts:89](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L89)

Payment processing errors, such as a card decline. `code` is the normalized
code (`UNKNOWN` for Square codes outside [SquareErrorCode](../type-aliases/SquareErrorCode.md)); `errors`
keeps Square's raw entries, which [declineReason](../functions/declineReason.md) reads.

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquarePaymentError**(`message`, `code`, `paymentId?`, `errors?`): `SquarePaymentError`

Defined in: [squareup/src/core/errors.ts:99](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L99)

#### Parameters

##### message

`string`

##### code

[`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

##### paymentId?

`string`

##### errors?

`object`[] = `[]`

#### Returns

`SquarePaymentError`

#### Overrides

[`SquareError`](SquareError.md).[`constructor`](SquareError.md#constructor)

## Properties

### code

> `readonly` **code**: [`SquareErrorCode`](../type-aliases/SquareErrorCode.md)

Defined in: [payments-core/src/errors/payments-error.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L38)

Normalized error code. Each provider defines its own union.

#### Inherited from

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L42)

The raw error body or other context, if any.

#### Inherited from

[`SquareError`](SquareError.md).[`details`](SquareError.md#details)

***

### errors

> `readonly` **errors**: `object`[]

Defined in: [squareup/src/core/errors.ts:92](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L92)

Square's error entries, with the raw `code` (for example `INSUFFICIENT_FUNDS`).

#### category

> **category**: `string`

#### code

> **code**: `string`

#### detail?

> `optional` **detail?**: `string`

#### field?

> `optional` **field?**: `string`

***

### paymentId?

> `readonly` `optional` **paymentId?**: `string`

Defined in: [squareup/src/core/errors.ts:90](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L90)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L40)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`SquareError`](SquareError.md).[`statusCode`](SquareError.md#statuscode)

## Methods

### \[hasInstance\]()

> `static` **\[hasInstance\]**(`value`): `boolean`

Defined in: [payments-core/src/errors/payments-error.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L60)

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

[`SquareError`](SquareError.md).[`[hasInstance]`](SquareError.md#hasinstance)
