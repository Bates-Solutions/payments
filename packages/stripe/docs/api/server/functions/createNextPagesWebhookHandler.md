[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / createNextPagesWebhookHandler

# Function: createNextPagesWebhookHandler()

> **createNextPagesWebhookHandler**(`config`): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [server/middleware/nextjs.ts:89](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/middleware/nextjs.ts#L89)

Create a Next.js Pages Router API handler.

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration

## Returns

An API route handler

(`req`, `res`) => `Promise`\<`void`\>

## Example

```typescript
// pages/api/webhook.ts
import { createNextPagesWebhookHandler } from '@bates-solutions/stripe/server';

export const config = {
  api: { bodyParser: false }, // Required for raw body
};

export default createNextPagesWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
});
```
