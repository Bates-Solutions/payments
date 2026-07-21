# Framework Middleware

Ready-made webhook handlers for Express, Next.js, and AWS Lambda. All take the same `signingSecret` + `handlers` config and share the [webhook processing](./webhooks.md) core.

## Express

The raw body is required for signature verification, so mount `express.raw` on the webhook route.

```typescript
import express from 'express';
import { createExpressWebhookHandler } from '@bates-solutions/stripe/server';

const app = express();

app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

app.post(
  '/webhooks/stripe',
  createExpressWebhookHandler({
    signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    handlers: {
      'payment_intent.succeeded': async (event) => {
        console.log('Paid:', event.data.object.id);
      },
    },
  })
);
```

By default the handler responds automatically (`200` on success, `400` on a bad signature, `500` on a handler error). Pass `autoRespond: false` to call `next()` instead and respond yourself; the parsed event is available as `req.stripeEvent`.

## Next.js (App Router)

```typescript
// app/api/webhooks/stripe/route.ts
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

For custom handling, use `parseNextWebhook(request, signingSecret)` which returns the verified event.

## Next.js (Pages Router)

Disable the body parser so the raw body is available.

```typescript
// pages/api/webhooks/stripe.ts
import { createNextPagesWebhookHandler } from '@bates-solutions/stripe/server';

export const config = { api: { bodyParser: false } };

export default createNextPagesWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
});
```

## AWS Lambda (API Gateway)

Handles CORS preflight, base64-decoded bodies, signature verification, and auto-extracts entity IDs into the handler `context`.

```typescript
import { createLambdaWebhookHandler } from '@bates-solutions/stripe/server';

export const handler = createLambdaWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event, context) => {
      // context.paymentIntentId / context.chargeId / context.customerId
      await fulfillOrder(context.paymentIntentId!);
    },
  },
  onUnhandledEvent: async (event) => {
    console.log('No handler for', event.type);
  },
});
```

Handler errors return `200` (so Stripe does not retry on your application bugs) with `{ success: false }` in the body — signature failures still return `400`.
