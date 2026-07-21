[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ProductsService

# Class: ProductsService

Defined in: core/services/products.service.ts:30

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

Defined in: core/services/products.service.ts:31

#### Parameters

##### client

`Stripe`

#### Returns

`ProductsService`

## Methods

### get()

> **get**(`productId`): `Promise`\<`Product`\>

Defined in: core/services/products.service.ts:57

Retrieve a product by ID.

#### Parameters

##### productId

`string`

#### Returns

`Promise`\<`Product`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Product`\>\>

Defined in: core/services/products.service.ts:36

List products with cursor-based pagination.

#### Parameters

##### options?

[`ListProductsOptions`](../interfaces/ListProductsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Product`\>\>
