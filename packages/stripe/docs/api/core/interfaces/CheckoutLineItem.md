[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CheckoutLineItem

# Interface: CheckoutLineItem

Defined in: [core/services/checkout.service.ts:32](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L32)

A line item for a Checkout Session (references an existing Price).

## Properties

### price

> **price**: `string`

Defined in: [core/services/checkout.service.ts:34](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L34)

Price ID (e.g. `price_…`)

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/services/checkout.service.ts:36](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L36)

Quantity (default 1)
