[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / createWebhookProcessor

# Function: createWebhookProcessor()

> **createWebhookProcessor**(`config`): (`rawBody`, `signature`) => `Promise`\<\{ `error?`: `string`; `event?`: `Event`; `success`: `boolean`; \}\>

Defined in: [server/webhook.ts:256](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/webhook.ts#L256)

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
