# Webhook Handling

Server utilities live in `@bates-solutions/clover/server`. They verify Clover's Hosted-Checkout webhook signature and route events to handlers — with no SDK and no Node built-ins, so the code runs on **Node 22+, Deno, Bun, and Cloudflare Workers**.

## Signature verification

Clover signs `${timestamp}.${rawBody}` with HMAC-SHA256 and sends it in the `clover-signature` header as `t=<ts>,v1=<sig>`. `verifySignature` reimplements that with WebCrypto and is **async**:

```typescript
import { verifySignature } from '@bates-solutions/clover/server';

const result = await verifySignature(
  rawBody,
  req.headers['clover-signature'],
  process.env.CLOVER_WEBHOOK_SECRET!
);

if (!result.valid) {
  return res.status(400).json({ error: result.error });
}
```

By default the timestamp must be within 300 seconds of now; pass `{ tolerance: 0 }` to disable that check. **Always verify against the raw request body** — re-serializing parsed JSON changes the bytes and breaks the signature.

## The URL-verification handshake

When you first register a webhook URL, Clover POSTs an unsigned `{ verificationCode }` body and expects a `200`. The framework handlers ([middleware](./middleware.md)) answer this automatically; if you verify manually, use `getVerificationCode`:

```typescript
import { parseWebhookEvent, getVerificationCode } from '@bates-solutions/clover/server';

const code = getVerificationCode(parseWebhookEvent(rawBody));
if (code) return Response.json({ verificationCode: code }, { status: 200 });
```

## Processing events

Dispatch on the event `type` with a handler map:

```typescript
import { createWebhookProcessor } from '@bates-solutions/clover/server';

const process = createWebhookProcessor({
  signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
  handlers: {
    CHARGE: async (event) => {
      await fulfill(event);
    },
  },
});

const result = await process(rawBody, signature);
```

An invalid signature is **never dispatched** — `throwOnInvalidSignature` only controls whether the failure throws or returns `{ success: false }`.

## Framework integration

See the [Middleware guide](./middleware.md) for the edge, Express, and Lambda handlers.
