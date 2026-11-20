[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListLineItemsOptions

# Interface: ListLineItemsOptions

Defined in: [stripe/src/core/services/checkout.service.ts:21](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/checkout.service.ts#L21)

Options for listing a session's line items

## Properties

### expandProduct?

> `optional` **expandProduct?**: `boolean`

Defined in: [stripe/src/core/services/checkout.service.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/checkout.service.ts#L26)

Expand `price.product` to the full Product (e.g. to read its metadata).

#### Default

```ts
false
```
