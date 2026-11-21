[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / StripeWebhookRequest

# Interface: StripeWebhookRequest

Defined in: [stripe/src/server/middleware/express.ts:8](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/middleware/express.ts#L8)

Extended Express Request carrying Stripe webhook data.

## Extends

- `Request`

## Properties

### rawBody?

> `optional` **rawBody?**: `string`

Defined in: [stripe/src/server/middleware/express.ts:10](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/middleware/express.ts#L10)

The raw request body as a string

***

### stripeEvent?

> `optional` **stripeEvent?**: `Event`

Defined in: [stripe/src/server/middleware/express.ts:12](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/middleware/express.ts#L12)

The parsed Stripe webhook event
