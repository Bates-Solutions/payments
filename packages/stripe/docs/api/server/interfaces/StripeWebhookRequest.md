[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / StripeWebhookRequest

# Interface: StripeWebhookRequest

Defined in: [server/middleware/express.ts:8](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/middleware/express.ts#L8)

Extended Express Request carrying Stripe webhook data.

## Extends

- `Request`

## Properties

### rawBody?

> `optional` **rawBody?**: `string`

Defined in: [server/middleware/express.ts:10](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/middleware/express.ts#L10)

The raw request body as a string

***

### stripeEvent?

> `optional` **stripeEvent?**: `Event`

Defined in: [server/middleware/express.ts:12](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/middleware/express.ts#L12)

The parsed Stripe webhook event
