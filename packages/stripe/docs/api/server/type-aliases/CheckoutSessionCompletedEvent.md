[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / CheckoutSessionCompletedEvent

# Type Alias: CheckoutSessionCompletedEvent

> **CheckoutSessionCompletedEvent** = `Extract`\<`Stripe.Event`, \{ `type`: `"checkout.session.completed"`; \}\>

<<<<<<< HEAD
Defined in: [server/types.ts:73](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L73)
=======
Defined in: [server/types.ts:73](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L73)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Convenience aliases for the subscription-lifecycle events, each narrowed to
its concrete `data.object` type. Handy for typing standalone handler
functions without re-deriving the `Extract<…>`.
