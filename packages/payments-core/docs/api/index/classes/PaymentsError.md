[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / PaymentsError

# Class: PaymentsError\<Code\>

Defined in: [errors/payments-error.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/errors/payments-error.ts#L25)

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

## Type Parameters

### Code

`Code` *extends* `string` = `string`

The provider's union of error codes.

## Constructors

### Constructor

> **new PaymentsError**\<`Code`\>(`message`, `code`, `statusCode?`, `details?`): `PaymentsError`\<`Code`\>

Defined in: [errors/payments-error.ts:33](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/errors/payments-error.ts#L33)

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

Defined in: [errors/payments-error.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/errors/payments-error.ts#L27)

Normalized error code. Each provider defines its own union.

***

### details?

> `readonly` `optional` **details?**: `unknown`

Defined in: [errors/payments-error.ts:31](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/errors/payments-error.ts#L31)

The raw error body or other context, if any.

***

### statusCode?

> `readonly` `optional` **statusCode?**: `number`

Defined in: [errors/payments-error.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/errors/payments-error.ts#L29)

HTTP status of the response that caused the error, if any.
