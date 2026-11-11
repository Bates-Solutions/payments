[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CreateCustomerOptions

# Interface: CreateCustomerOptions

Defined in: [core/services/customers.service.ts:23](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L23)

Options for creating a customer. `email`/`phone` are conveniences that map to
Clover's `emailAddresses` / `phoneNumbers` arrays.

## Properties

### email?

> `optional` **email?**: `string`

Defined in: [core/services/customers.service.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L26)

***

### firstName?

> `optional` **firstName?**: `string`

Defined in: [core/services/customers.service.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L24)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/customers.service.ts:31](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L31)

Idempotency key (defaults to a generated UUID)

***

### lastName?

> `optional` **lastName?**: `string`

Defined in: [core/services/customers.service.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L25)

***

### marketingAllowed?

> `optional` **marketingAllowed?**: `boolean`

Defined in: [core/services/customers.service.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L28)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\>

Defined in: [core/services/customers.service.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L29)

***

### phone?

> `optional` **phone?**: `string`

Defined in: [core/services/customers.service.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L27)
