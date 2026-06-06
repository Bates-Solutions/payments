[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / createNextWebhookHandler

# Function: createNextWebhookHandler()

> **createNextWebhookHandler**(`config`): (`request`) => `Promise`\<`Response`\>

Defined in: [server/middleware/nextjs.ts:66](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/middleware/nextjs.ts#L66)

Create a Next.js App Router webhook handler

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration

## Returns

Route handler for POST requests

(`request`) => `Promise`\<`Response`\>

## Example

```typescript
// app/api/webhook/route.ts
import { createNextWebhookHandler } from '@bates-solutions/squareup/server';

export const POST = createNextWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
  handlers: {
    'payment.created': async (event) => {
      console.log('Payment created:', event.data.id);
    },
    'order.fulfillment.updated': async (event) => {
      await notifyCustomer(event.data.object);
    },
  },
});
```
