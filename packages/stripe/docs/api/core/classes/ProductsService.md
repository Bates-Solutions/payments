[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ProductsService

# Class: ProductsService

Defined in: [core/services/products.service.ts:81](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/products.service.ts#L81)

Products service wrapping Stripe [Products](https://docs.stripe.com/api/products).

## Example

```typescript
const product = await stripe.products.create({
  name: 'Sourdough loaf',
  metadata: { supplierSku: 'SD-001' },
});
await stripe.products.update(product.id, { description: 'Baked daily' });
await stripe.products.archive(product.id);
```

## Constructors

### Constructor

> **new ProductsService**(`client`): `ProductsService`

Defined in: [core/services/products.service.ts:82](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/products.service.ts#L82)

#### Parameters

##### client

`Stripe`

#### Returns

`ProductsService`

## Methods

### archive()

> **archive**(`productId`, `options?`): `Promise`\<`Product`\>

Defined in: [core/services/products.service.ts:200](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/products.service.ts#L200)

Archive a product (`active: false`). Stripe keeps archived products so
past payments still reference them, but they can no longer be bought.
Restore one with `update(id, { active: true })`.

#### Parameters

##### productId

`string`

##### options?

###### idempotencyKey?

`string`

#### Returns

`Promise`\<`Product`\>

#### Throws

When `productId` is missing

***

### create()

> **create**(`options`): `Promise`\<`Product`\>

Defined in: [core/services/products.service.ts:130](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/products.service.ts#L130)

Create a product.

#### Parameters

##### options

[`CreateProductOptions`](../interfaces/CreateProductOptions.md)

#### Returns

`Promise`\<`Product`\>

#### Throws

When `name` is missing or blank

#### Example

```typescript
const product = await stripe.products.create({
  name: 'Sourdough loaf',
  description: 'Naturally leavened',
  metadata: { supplierSku: 'SD-001' },
});
```

***

### get()

> **get**(`productId`): `Promise`\<`Product`\>

Defined in: [core/services/products.service.ts:108](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/products.service.ts#L108)

Retrieve a product by ID.

#### Parameters

##### productId

`string`

#### Returns

`Promise`\<`Product`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Product`\>\>

Defined in: [core/services/products.service.ts:87](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/products.service.ts#L87)

List products with cursor-based pagination.

#### Parameters

##### options?

[`ListProductsOptions`](../interfaces/ListProductsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Product`\>\>

***

### update()

> **update**(`productId`, `options`): `Promise`\<`Product`\>

Defined in: [core/services/products.service.ts:167](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/products.service.ts#L167)

Update a product. Only the fields you pass are changed.

#### Parameters

##### productId

`string`

##### options

[`UpdateProductOptions`](../interfaces/UpdateProductOptions.md)

#### Returns

`Promise`\<`Product`\>

#### Throws

When `productId` is missing, or `name` is
given but blank

#### Example

```typescript
await stripe.products.update('prod_123', {
  name: 'Sourdough loaf (large)',
  metadata: { supplierSku: 'SD-002' },
});
```
