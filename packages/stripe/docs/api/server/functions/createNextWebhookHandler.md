[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / createNextWebhookHandler

# Function: createNextWebhookHandler()

> **createNextWebhookHandler**(`config`): (`request`) => `Promise`\<`Response`\>

Defined in: server/middleware/nextjs.ts:58

Create a Next.js App Router webhook handler.

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration

## Returns

A route handler for POST requests

(`request`) => `Promise`\<`Response`\>

## Example

```typescript
// app/api/webhook/route.ts
import { createNextWebhookHandler } from '@bates-solutions/stripe/server';

export const POST = createNextWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
});
```
