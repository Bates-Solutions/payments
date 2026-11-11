[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CheckoutLineItem

# Interface: CheckoutLineItem

Defined in: [core/services/checkout.service.ts:32](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L32)

A line item for a Checkout Session (references an existing Price).

## Properties

### price

> **price**: `string`

Defined in: [core/services/checkout.service.ts:34](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L34)

Price ID (e.g. `price_…`)

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/services/checkout.service.ts:36](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L36)

Quantity (default 1)
