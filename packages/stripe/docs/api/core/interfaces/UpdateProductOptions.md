[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / UpdateProductOptions

# Interface: UpdateProductOptions

Defined in: [core/services/products.service.ts:48](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L48)

Options for updating a product. Only the fields you pass are changed.

## Properties

### active?

> `optional` **active?**: `boolean`

Defined in: [core/services/products.service.ts:54](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L54)

Archive (`false`) or restore (`true`) the product

***

### defaultPriceId?

> `optional` **defaultPriceId?**: `string`

Defined in: [core/services/products.service.ts:63](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L63)

Make this price the product's default price

***

### description?

> `optional` **description?**: `string`

Defined in: [core/services/products.service.ts:52](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L52)

New description. Pass `''` to clear it.

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/products.service.ts:65](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L65)

Idempotency key (defaults to a generated UUID)

***

### images?

> `optional` **images?**: `string`[]

Defined in: [core/services/products.service.ts:56](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L56)

Replace the image URLs

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/products.service.ts:61](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L61)

Metadata to merge into the existing metadata. Set a key to `''` to remove
it.

***

### name?

> `optional` **name?**: `string`

Defined in: [core/services/products.service.ts:50](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L50)

New name (must not be empty when given)
