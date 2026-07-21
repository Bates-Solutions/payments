[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / createExpressWebhookHandler

# Function: createExpressWebhookHandler()

> **createExpressWebhookHandler**(`config`): `RequestHandler`

Defined in: server/middleware/express.ts:58

Create Express middleware for handling Stripe webhooks.

This middleware:
1. Reads the raw body (required for signature verification)
2. Verifies the webhook signature
3. Parses the event and attaches it to the request
4. Calls the appropriate handler

## Parameters

### config

[`ExpressWebhookOptions`](../interfaces/ExpressWebhookOptions.md)

Webhook configuration

## Returns

`RequestHandler`

Express request handler

## Example

```typescript
import express from 'express';
import { createExpressWebhookHandler } from '@bates-solutions/stripe/server';

const app = express();

// IMPORTANT: use the raw body parser for the webhook route
app.use('/webhook', express.raw({ type: 'application/json' }));

app.post('/webhook', createExpressWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
}));
```
