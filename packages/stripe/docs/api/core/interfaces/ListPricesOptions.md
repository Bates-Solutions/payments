[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListPricesOptions

# Interface: ListPricesOptions

Defined in: [core/services/prices.service.ts:13](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/prices.service.ts#L13)

Options for listing prices

## Properties

### active?

> `optional` **active?**: `boolean`

Defined in: [core/services/prices.service.ts:15](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/prices.service.ts#L15)

Only return active (or inactive) prices

***

### expandProduct?

> `optional` **expandProduct?**: `boolean`

Defined in: [core/services/prices.service.ts:25](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/prices.service.ts#L25)

Expand the related product inline (`price.product` becomes the full
`Stripe.Product` instead of an ID). Handy for reading product metadata.

#### Default

```ts
false
```

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/prices.service.ts:18](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/prices.service.ts#L18)

***

### product?

> `optional` **product?**: `string`

Defined in: [core/services/prices.service.ts:17](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/prices.service.ts#L17)

Only return prices for this product

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/services/prices.service.ts:19](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/prices.service.ts#L19)
