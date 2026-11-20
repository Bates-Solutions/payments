[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / PaymentsError

# Class: PaymentsError\<Code\>

Defined in: [payments-core/src/errors/payments-error.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L28)

Base class for the errors each provider package throws (`SquareError`,
`StripeError`, `CloverError`). It carries a provider-specific `code`, plus the
HTTP status and raw details when the error came from an API response.

Catch it to handle any provider's error in one place. That works across
providers only when they resolve the same copy of this package: core is
0.x, so providers built on different minors install separate copies, each
with its own `PaymentsError` class.

## Example

```typescript
try {
  await client.payments.create(input);
} catch (error) {
  if (error instanceof PaymentsError) {
    console.error(error.name, error.code, error.statusCode);
  }
  throw error;
}
```

## Extends

- `Error`

## Extended by

- [`SquareError`](SquareError.md)

## Type Parameters

### Code

`Code` *extends* `string` = `string`

The provider's union of error codes.

## Constructors

### Constructor

> **new PaymentsError**\<`Code`\>(`message`, `code`, `statusCode?`, `details?`): `PaymentsError`\<`Code`\>

Defined in: [payments-core/src/errors/payments-error.ts:36](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L36)

#### Parameters

##### message

`string`

##### code

`Code`

##### statusCode?

`number`

##### details?

`unknown`

#### Returns

`PaymentsError`\<`Code`\>

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: `Code`

Defined in: [payments-core/src/errors/payments-error.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L30)

Normalized error code. Each provider defines its own union.

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/src/errors/payments-error.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L34)

The raw error body or other context, if any.

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/src/errors/payments-error.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/../../payments-core/src/errors/payments-error.ts#L32)

HTTP status of the response that caused the error, if any.
