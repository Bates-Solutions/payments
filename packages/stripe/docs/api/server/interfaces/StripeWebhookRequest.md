[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / StripeWebhookRequest

# Interface: StripeWebhookRequest

<<<<<<< HEAD
Defined in: [server/middleware/express.ts:8](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/express.ts#L8)
=======
Defined in: [server/middleware/express.ts:8](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/express.ts#L8)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Extended Express Request carrying Stripe webhook data.

## Extends

- `Request`

## Properties

### rawBody?

> `optional` **rawBody?**: `string`

<<<<<<< HEAD
Defined in: [server/middleware/express.ts:10](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/express.ts#L10)
=======
Defined in: [server/middleware/express.ts:10](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/express.ts#L10)
>>>>>>> feat/edge-webhook-and-subscription-helpers

The raw request body as a string

***

### stripeEvent?

> `optional` **stripeEvent?**: `Event`

<<<<<<< HEAD
Defined in: [server/middleware/express.ts:12](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/express.ts#L12)
=======
Defined in: [server/middleware/express.ts:12](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/express.ts#L12)
>>>>>>> feat/edge-webhook-and-subscription-helpers

The parsed Stripe webhook event
