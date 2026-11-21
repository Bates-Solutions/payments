[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListPricesOptions

# Interface: ListPricesOptions

Defined in: [stripe/src/core/services/prices.service.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L14)

Options for listing prices

## Properties

### active?

> `optional` **active?**: `boolean`

Defined in: [stripe/src/core/services/prices.service.ts:16](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L16)

Only return active (or inactive) prices

***

### expandProduct?

> `optional` **expandProduct?**: `boolean`

Defined in: [stripe/src/core/services/prices.service.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L26)

Expand the related product inline (`price.product` becomes the full
`Stripe.Product` instead of an ID). Handy for reading product metadata.

#### Default

```ts
false
```

***

### limit?

> `optional` **limit?**: `number`

Defined in: [stripe/src/core/services/prices.service.ts:19](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L19)

***

### product?

> `optional` **product?**: `string`

Defined in: [stripe/src/core/services/prices.service.ts:18](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L18)

Only return prices for this product

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [stripe/src/core/services/prices.service.ts:20](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/prices.service.ts#L20)
