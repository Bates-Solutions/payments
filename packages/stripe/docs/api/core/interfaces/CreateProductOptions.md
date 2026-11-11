[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateProductOptions

# Interface: CreateProductOptions

Defined in: [core/services/products.service.ts:24](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L24)

Options for creating a product

## Properties

### active?

> `optional` **active?**: `boolean`

Defined in: [core/services/products.service.ts:33](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L33)

Whether the product can be bought.

#### Default

```ts
true
```

***

### description?

> `optional` **description?**: `string`

Defined in: [core/services/products.service.ts:28](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L28)

Longer description shown to customers

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/products.service.ts:42](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L42)

Idempotency key (defaults to a generated UUID)

***

### images?

> `optional` **images?**: `string`[]

Defined in: [core/services/products.service.ts:35](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L35)

Up to 8 image URLs

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/products.service.ts:40](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L40)

Key/value metadata. Use it to tag the product with your own id so you can
find it again on a later sync.

***

### name

> **name**: `string`

Defined in: [core/services/products.service.ts:26](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/products.service.ts#L26)

Product name shown to customers (required, non-empty)
