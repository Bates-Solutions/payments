[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CheckoutLineItem

# Interface: CheckoutLineItem

Defined in: [core/services/checkout.service.ts:14](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/checkout.service.ts#L14)

A line item for a Checkout Session (references an existing Price).

## Properties

### price

> **price**: `string`

Defined in: [core/services/checkout.service.ts:16](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/checkout.service.ts#L16)

Price ID (e.g. `price_…`)

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/services/checkout.service.ts:18](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/services/checkout.service.ts#L18)

Quantity (default 1)
