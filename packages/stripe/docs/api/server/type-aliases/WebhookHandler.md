[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookHandler

# Type Alias: WebhookHandler\<E\>

> **WebhookHandler**\<`E`\> = (`event`) => `void` \| `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [server/types.ts:19](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L19)
=======
Defined in: [server/types.ts:19](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L19)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Handler for a webhook event of a specific type.

## Type Parameters

### E

`E` *extends* [`WebhookEvent`](WebhookEvent.md) = [`WebhookEvent`](WebhookEvent.md)

## Parameters

### event

`E`

## Returns

`void` \| `Promise`\<`void`\>
