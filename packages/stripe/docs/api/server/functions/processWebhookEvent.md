[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / processWebhookEvent

# Function: processWebhookEvent()

> **processWebhookEvent**(`event`, `config`): `Promise`\<`void`\>

Defined in: [server/webhook.ts:223](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/webhook.ts#L223)

Process a webhook event by calling the handler registered for its type.

## Parameters

### event

`Event`

The parsed webhook event

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration with handlers

## Returns

`Promise`\<`void`\>

## Example

```typescript
await processWebhookEvent(event, {
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
});
```
