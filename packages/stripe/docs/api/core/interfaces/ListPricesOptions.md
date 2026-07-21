[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListPricesOptions

# Interface: ListPricesOptions

Defined in: core/services/prices.service.ts:13

Options for listing prices

## Properties

### active?

> `optional` **active?**: `boolean`

Defined in: core/services/prices.service.ts:15

Only return active (or inactive) prices

***

### expandProduct?

> `optional` **expandProduct?**: `boolean`

Defined in: core/services/prices.service.ts:25

Expand the related product inline (`price.product` becomes the full
`Stripe.Product` instead of an ID). Handy for reading product metadata.

#### Default

```ts
false
```

***

### limit?

> `optional` **limit?**: `number`

Defined in: core/services/prices.service.ts:18

***

### product?

> `optional` **product?**: `string`

Defined in: core/services/prices.service.ts:17

Only return prices for this product

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: core/services/prices.service.ts:19
