[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / createWebhookProcessor

# Function: createWebhookProcessor()

> **createWebhookProcessor**(`config`): (`rawBody`, `signature`) => `Promise`\<\{ `error?`: `string`; `event?`: [`WebhookEvent`](../interfaces/WebhookEvent.md)\<`unknown`\>; `success`: `boolean`; \}\>

Defined in: [server/webhook.ts:207](https://github.com/mbates/squareup/blob/9247d66f2d6844e833a2dc69bc01a9537b493e7a/src/server/webhook.ts#L207)

Create a webhook handler function that verifies and processes events

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration

## Returns

Handler function that processes raw webhook requests

(`rawBody`, `signature`) => `Promise`\<\{ `error?`: `string`; `event?`: [`WebhookEvent`](../interfaces/WebhookEvent.md)\<`unknown`\>; `success`: `boolean`; \}\>

## Example

```typescript
const handleWebhook = createWebhookProcessor({
  signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
  handlers: {
    'payment.created': async (event) => {
      await sendReceipt(event.data.object.payment);
    },
    'order.updated': async (event) => {
      await updateOrderStatus(event.data.object.order);
    },
  },
});

// Use in your route handler
const result = await handleWebhook(rawBody, signature);
```
