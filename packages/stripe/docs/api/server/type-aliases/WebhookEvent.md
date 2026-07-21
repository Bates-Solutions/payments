[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookEvent

# Type Alias: WebhookEvent

> **WebhookEvent** = `Stripe.Event`

Defined in: [server/types.ts:9](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/types.ts#L9)

A verified Stripe webhook event.

This is the Stripe SDK's `Event` type — a discriminated union on `type`, so
narrowing on `event.type` gives you the correct `event.data.object` shape.
