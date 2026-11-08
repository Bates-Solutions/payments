[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / CheckoutSessionCompletedEvent

# Type Alias: CheckoutSessionCompletedEvent

> **CheckoutSessionCompletedEvent** = `Extract`\<`Stripe.Event`, \{ `type`: `"checkout.session.completed"`; \}\>

Defined in: [server/types.ts:73](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/server/types.ts#L73)

Convenience aliases for the subscription-lifecycle events, each narrowed to
its concrete `data.object` type. Handy for typing standalone handler
functions without re-deriving the `Extract<…>`.
