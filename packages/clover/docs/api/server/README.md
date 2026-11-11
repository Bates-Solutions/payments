[**@bates-solutions/clover API Reference v1.1.0**](../README.md)

***

[@bates-solutions/clover API Reference](../README.md) / server

# server

`@bates-solutions/clover/server` — webhook helpers for the Clover wrapper.

Server utilities for handling Clover webhooks: signature verification plus a
typed handler-map dispatch, with adapters for Express, AWS Lambda, and a
framework-neutral Web/edge handler. Verification uses WebCrypto, so it runs on
Node, Deno, Bun, and Cloudflare Workers.

## Example

```typescript
import { createWebhookHandler } from '@bates-solutions/clover/server';

const handler = createWebhookHandler({
  signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
  handlers: { CHARGE: async (event) => { console.log(event); } },
});
```

## Interfaces

- [CloverWebhookRequest](interfaces/CloverWebhookRequest.md)
- [ExpressWebhookOptions](interfaces/ExpressWebhookOptions.md)
- [LambdaProxyEvent](interfaces/LambdaProxyEvent.md)
- [LambdaProxyResult](interfaces/LambdaProxyResult.md)
- [LambdaWebhookConfig](interfaces/LambdaWebhookConfig.md)
- [ParsedWebhookRequest](interfaces/ParsedWebhookRequest.md)
- [VerifyOptions](interfaces/VerifyOptions.md)
- [WebhookConfig](interfaces/WebhookConfig.md)
- [WebhookEvent](interfaces/WebhookEvent.md)
- [WebhookLogger](interfaces/WebhookLogger.md)
- [WebhookVerificationResult](interfaces/WebhookVerificationResult.md)

## Type Aliases

- [WebhookHandler](type-aliases/WebhookHandler.md)
- [WebhookHandlers](type-aliases/WebhookHandlers.md)

## Variables

- [SIGNATURE\_HEADER](variables/SIGNATURE_HEADER.md)

## Functions

- [createExpressWebhookHandler](functions/createExpressWebhookHandler.md)
- [createLambdaWebhookHandler](functions/createLambdaWebhookHandler.md)
- [createWebhookHandler](functions/createWebhookHandler.md)
- [createWebhookProcessor](functions/createWebhookProcessor.md)
- [getVerificationCode](functions/getVerificationCode.md)
- [parseAndVerifyWebhook](functions/parseAndVerifyWebhook.md)
- [parseWebhookEvent](functions/parseWebhookEvent.md)
- [processWebhookEvent](functions/processWebhookEvent.md)
- [verifySignature](functions/verifySignature.md)
