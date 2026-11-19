[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / requireNonEmpty

# Function: requireNonEmpty()

> **requireNonEmpty**(`value`, `field`, `createError`): `asserts value is string`

Defined in: [errors/require-non-empty.ts:16](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/errors/require-non-empty.ts#L16)

Throw when a required string option is missing or empty, using the provider's
own validation error. Narrows `value` to `string` afterwards.

## Parameters

### value

`string` \| `undefined`

The option's value.

### field

`string`

The option's name, used in the message (`${field} is required`).

### createError

(`message`, `field`) => `Error`

Builds the error to throw from the message and field name.

## Returns

`asserts value is string`

## Example

```typescript
requireNonEmpty(options.clientId, 'clientId', (message, field) =>
  new CloverValidationError(message, field)
);
```
