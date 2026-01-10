[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / processWebhookEvent

# Function: processWebhookEvent()

> **processWebhookEvent**(`event`, `config`): `Promise`\<`void`\>

Defined in: [src/server/webhook.ts:170](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/webhook.ts#L170)

Process a webhook event by calling the appropriate handler

## Parameters

### event

[`WebhookEvent`](../interfaces/WebhookEvent.md)

The parsed webhook event

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration with handlers

## Returns

`Promise`\<`void`\>

Promise that resolves when handler completes

## Example

```typescript
await processWebhookEvent(event, {
  signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
  handlers: {
    'payment.created': async (event) => {
      console.log('Payment created:', event.data.id);
    },
  },
});
```
