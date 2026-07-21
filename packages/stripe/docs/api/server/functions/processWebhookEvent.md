[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / processWebhookEvent

# Function: processWebhookEvent()

> **processWebhookEvent**(`event`, `config`): `Promise`\<`void`\>

Defined in: [server/webhook.ts:220](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/server/webhook.ts#L220)

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
