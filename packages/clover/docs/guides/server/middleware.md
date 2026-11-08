# Framework Middleware

Ready-made Clover webhook handlers. All take the same `signingSecret` + `handlers` config, verify the signature with WebCrypto, and answer Clover's URL-verification handshake automatically.

## Edge / Deno / Workers (framework-neutral)

`createWebhookHandler` takes a Web `Request` and returns a Web `Response` — it runs on Deno (`Deno.serve`), Cloudflare Workers, Bun, edge functions, and the Next.js App Router.

```typescript
// Supabase Edge Function / Deno
import { createWebhookHandler } from '@bates-solutions/clover/server';

const handler = createWebhookHandler({
  signingSecret: Deno.env.get('CLOVER_WEBHOOK_SECRET')!,
  handlers: {
    CHARGE: async (event) => {
      await fulfill(event);
    },
  },
});

Deno.serve(handler);
```

## Express

The raw body is required for signature verification, so mount `express.raw` on the webhook route.

```typescript
import express from 'express';
import { createExpressWebhookHandler } from '@bates-solutions/clover/server';

const app = express();
app.use('/webhooks/clover', express.raw({ type: 'application/json' }));

app.post(
  '/webhooks/clover',
  createExpressWebhookHandler({
    signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
    handlers: { CHARGE: async (event) => { await fulfill(event); } },
  })
);
```

By default the handler responds automatically (`200` on success, `400` on a bad/missing signature, `500` on a handler error). Pass `autoRespond: false` to call `next()` instead; the parsed event is on `req.cloverEvent`.

## AWS Lambda (API Gateway)

Handles CORS preflight, base64-decoded bodies, the handshake, verification, and dispatch.

```typescript
import { createLambdaWebhookHandler } from '@bates-solutions/clover/server';

export const handler = createLambdaWebhookHandler({
  signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
  handlers: { CHARGE: async (event) => { await fulfill(event); } },
});
```

Handler errors return `200` (so Clover does not retry on your application bugs) with `{ success: false }` in the body — signature failures still return `400`.
