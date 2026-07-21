[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / createWebhookProcessor

# Function: createWebhookProcessor()

> **createWebhookProcessor**(`config`): (`rawBody`, `signature`) => `Promise`\<\{ `error?`: `string`; `event?`: `Event`; `success`: `boolean`; \}\>

<<<<<<< HEAD
Defined in: [server/webhook.ts:256](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/webhook.ts#L256)
=======
Defined in: [server/webhook.ts:253](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/webhook.ts#L253)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Create a webhook handler that verifies and processes raw webhook requests.

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration

## Returns

A function that processes a raw webhook request

(`rawBody`, `signature`) => `Promise`\<\{ `error?`: `string`; `event?`: `Event`; `success`: `boolean`; \}\>

## Example

```typescript
const handleWebhook = createWebhookProcessor({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      await fulfillOrder(event.data.object);
    },
  },
});

const result = await handleWebhook(rawBody, signature);
```
