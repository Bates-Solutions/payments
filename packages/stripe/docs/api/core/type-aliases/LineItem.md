[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / LineItem

# Type Alias: LineItem

> **LineItem** = `Stripe.LineItem`

Defined in: [stripe/src/core/services/checkout.service.ts:16](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/checkout.service.ts#L16)

A line item that was sold (on a Checkout Session or Payment Link). `price`
holds the Price (and its `product`), `quantity` and `amount_total` what was
bought.
