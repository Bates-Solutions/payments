[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CheckoutLineItem

# Interface: CheckoutLineItem

Defined in: core/services/checkout.service.ts:14

A line item for a Checkout Session (references an existing Price).

## Properties

### price

> **price**: `string`

Defined in: core/services/checkout.service.ts:16

Price ID (e.g. `price_…`)

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: core/services/checkout.service.ts:18

Quantity (default 1)
