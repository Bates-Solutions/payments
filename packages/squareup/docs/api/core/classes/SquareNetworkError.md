[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareNetworkError

# Class: SquareNetworkError

Defined in: [squareup/src/core/errors.ts:114](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L114)

The request never got an HTTP response: a connection failure (DNS, reset,
`fetch failed`) or a client-side timeout. Square may or may not have
processed the request. `statusCode` is always undefined.

`cause` holds the SDK error. It never contains the request, so secrets
such as an OAuth `client_secret` are not exposed.

## Extends

- [`SquareError`](SquareError.md)

## Constructors

### Constructor

> **new SquareNetworkError**(`message`, `code`, `options?`): `SquareNetworkError`

Defined in: [squareup/src/core/errors.ts:117](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L117)

#### Parameters

##### message

`string`

##### code

`"NETWORK_ERROR"` \| `"TIMEOUT"`

##### options?

###### cause?

`unknown`

#### Returns

`SquareNetworkError`

#### Overrides

[`SquareError`](SquareError.md).[`constructor`](SquareError.md#constructor)

## Properties

### code

> `readonly` **code**: `"NETWORK_ERROR"` \| `"TIMEOUT"`

Defined in: [squareup/src/core/errors.ts:115](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L115)

Normalized error code. Each provider defines its own union.

#### Overrides

[`SquareError`](SquareError.md).[`code`](SquareError.md#code)

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

The raw error body or other context, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`details`](PaymentsError.md#details)

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/dist/errors/payments-error.d.ts#L26)

HTTP status of the response that caused the error, if any.

#### Inherited from

[`PaymentsError`](PaymentsError.md).[`statusCode`](PaymentsError.md#statuscode)
