[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / PaymentsError

# Class: PaymentsError\<Code\>

Defined in: [payments-core/dist/errors/payments-error.d.ts:22](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L22)

Base class for the errors each provider package throws (`SquareError`,
`StripeError`, `CloverError`). It carries a provider-specific `code`, plus the
HTTP status and raw details when the error came from an API response.

Catch it to handle any provider's error in one place:

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

- [`CloverError`](CloverError.md)

## Type Parameters

### Code

`Code` *extends* `string` = `string`

The provider's union of error codes.

## Constructors

### Constructor

> **new PaymentsError**\<`Code`\>(`message`, `code`, `statusCode?`, `details?`): `PaymentsError`\<`Code`\>

Defined in: [payments-core/dist/errors/payments-error.d.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L29)

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

Defined in: [payments-core/dist/errors/payments-error.d.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L24)

Normalized error code. Each provider defines its own union.

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [payments-core/dist/errors/payments-error.d.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L28)

The raw error body or other context, if any.

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [payments-core/dist/errors/payments-error.d.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/../../payments-core/dist/errors/payments-error.d.ts#L26)

HTTP status of the response that caused the error, if any.
