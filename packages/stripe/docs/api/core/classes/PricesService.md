[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PricesService

# Class: PricesService

Defined in: core/services/prices.service.ts:41

Prices service wrapping Stripe [Prices](https://docs.stripe.com/api/prices).

## Example

```typescript
// List active prices with their product expanded (read product metadata)
const { data } = await stripe.prices.list({ active: true, expandProduct: true });
for (const price of data) {
  const product = price.product as Stripe.Product;
  console.log(product.metadata.tier, price.unit_amount, price.recurring?.interval);
}
```

## Constructors

### Constructor

> **new PricesService**(`client`): `PricesService`

Defined in: core/services/prices.service.ts:42

#### Parameters

##### client

`Stripe`

#### Returns

`PricesService`

## Methods

### get()

> **get**(`priceId`, `options?`): `Promise`\<`Price`\>

Defined in: core/services/prices.service.ts:70

Retrieve a price by ID, optionally expanding its product.

#### Parameters

##### priceId

`string`

##### options?

###### expandProduct?

`boolean`

#### Returns

`Promise`\<`Price`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Price`\>\>

Defined in: core/services/prices.service.ts:47

List prices with cursor-based pagination.

#### Parameters

##### options?

[`ListPricesOptions`](../interfaces/ListPricesOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Price`\>\>
