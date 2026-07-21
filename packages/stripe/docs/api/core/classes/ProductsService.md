[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ProductsService

# Class: ProductsService

Defined in: [core/services/products.service.ts:30](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/products.service.ts#L30)

Products service wrapping Stripe [Products](https://docs.stripe.com/api/products).

## Example

```typescript
const { data } = await stripe.products.list({ active: true });
const product = await stripe.products.get('prod_123');
console.log(product.metadata);
```

## Constructors

### Constructor

> **new ProductsService**(`client`): `ProductsService`

Defined in: [core/services/products.service.ts:31](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/products.service.ts#L31)

#### Parameters

##### client

`Stripe`

#### Returns

`ProductsService`

## Methods

### get()

> **get**(`productId`): `Promise`\<`Product`\>

Defined in: [core/services/products.service.ts:57](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/products.service.ts#L57)

Retrieve a product by ID.

#### Parameters

##### productId

`string`

#### Returns

`Promise`\<`Product`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Product`\>\>

Defined in: [core/services/products.service.ts:36](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/products.service.ts#L36)

List products with cursor-based pagination.

#### Parameters

##### options?

[`ListProductsOptions`](../interfaces/ListProductsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Product`\>\>
