[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / LineItem

# Type Alias: LineItem

> **LineItem** = `Stripe.LineItem`

Defined in: [core/services/checkout.service.ts:16](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L16)

A line item that was sold (on a Checkout Session or Payment Link). `price`
holds the Price (and its `product`), `quantity` and `amount_total` what was
bought.
