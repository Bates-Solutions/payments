[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / createNextPagesWebhookHandler

# Function: createNextPagesWebhookHandler()

> **createNextPagesWebhookHandler**(`config`): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [server/middleware/nextjs.ts:140](https://github.com/mbates/squareup/blob/9247d66f2d6844e833a2dc69bc01a9537b493e7a/src/server/middleware/nextjs.ts#L140)

Create a Next.js Pages Router API handler

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration

## Returns

API route handler

(`req`, `res`) => `Promise`\<`void`\>

## Example

```typescript
// pages/api/webhook.ts
import { createNextPagesWebhookHandler } from '@bates-solutions/squareup/server';

export const config = {
  api: { bodyParser: false }, // Required for raw body
};

export default createNextPagesWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
  handlers: {
    'payment.created': async (event) => {
      console.log('Payment:', event.data.id);
    },
  },
});
```
