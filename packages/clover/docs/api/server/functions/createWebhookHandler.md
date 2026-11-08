[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / createWebhookHandler

# Function: createWebhookHandler()

> **createWebhookHandler**(`config`): (`request`) => `Promise`\<`Response`\>

Defined in: server/middleware/web.ts:35

Create a framework-neutral Clover webhook handler on the Web platform.

Takes a standard `Request` and returns a standard `Response` using only Web
APIs (WebCrypto verification, `request.text()`, `Response.json`). Runs on
Deno (`Deno.serve`), Cloudflare Workers, Bun, edge functions, and the Next.js
App Router.

It also answers Clover's initial URL-verification handshake automatically:
an unsigned `{ verificationCode }` POST is echoed back with `200`.

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

## Returns

(`request`) => `Promise`\<`Response`\>

## Example

```typescript
import { createWebhookHandler } from '@bates-solutions/clover/server';

const handler = createWebhookHandler({
  signingSecret: Deno.env.get('CLOVER_WEBHOOK_SECRET')!,
  handlers: {
    CHARGE: async (event) => { await fulfill(event); },
  },
});

Deno.serve(handler);
```
