[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / createWebhookHandler

# Function: createWebhookHandler()

> **createWebhookHandler**(`config`): (`request`) => `Promise`\<`Response`\>

<<<<<<< HEAD
Defined in: [server/middleware/web.ts:32](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/web.ts#L32)
=======
Defined in: [server/middleware/web.ts:32](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/web.ts#L32)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Create a framework-neutral webhook handler built on the Web platform.

Takes a standard `Request` and returns a standard `Response`, using only Web
APIs (`request.text()`, WebCrypto verification, `Response.json`). It runs
unchanged on any runtime that speaks the Fetch API — Deno (`Deno.serve`),
Cloudflare Workers, Bun, Vercel/Netlify edge, and Next.js App Router.

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

Webhook configuration

## Returns

An async handler: `(request: Request) => Promise<Response>`

(`request`) => `Promise`\<`Response`\>

## Example

```typescript
// Supabase Edge Function / Deno
import { createWebhookHandler } from '@bates-solutions/stripe/server';

const handler = createWebhookHandler({
  signingSecret: Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
  handlers: {
    'checkout.session.completed': async (event) => {
      await activateSubscription(event.data.object);
    },
  },
});

Deno.serve(handler);
```
