[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / ParsedWebhookRequest

# Interface: ParsedWebhookRequest

<<<<<<< HEAD
Defined in: [server/types.ts:93](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L93)
=======
Defined in: [server/types.ts:93](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L93)
>>>>>>> feat/edge-webhook-and-subscription-helpers

A parsed and verified webhook request.

## Properties

### event

> **event**: `Event`

<<<<<<< HEAD
Defined in: [server/types.ts:99](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L99)
=======
Defined in: [server/types.ts:99](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L99)
>>>>>>> feat/edge-webhook-and-subscription-helpers

The parsed event

***

### rawBody

> **rawBody**: `string`

<<<<<<< HEAD
Defined in: [server/types.ts:95](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L95)
=======
Defined in: [server/types.ts:95](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L95)
>>>>>>> feat/edge-webhook-and-subscription-helpers

The raw request body

***

### signature

> **signature**: `string`

<<<<<<< HEAD
Defined in: [server/types.ts:97](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L97)
=======
Defined in: [server/types.ts:97](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L97)
>>>>>>> feat/edge-webhook-and-subscription-helpers

The signature from the `stripe-signature` header
