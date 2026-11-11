[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookEvent

# Type Alias: WebhookEvent

> **WebhookEvent** = `Stripe.Event`

Defined in: [server/types.ts:9](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/types.ts#L9)

A verified Stripe webhook event.

This is the Stripe SDK's `Event` type — a discriminated union on `type`, so
narrowing on `event.type` gives you the correct `event.data.object` shape.
