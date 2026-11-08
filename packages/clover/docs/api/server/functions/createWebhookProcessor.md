[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / createWebhookProcessor

# Function: createWebhookProcessor()

> **createWebhookProcessor**(`config`): (`rawBody`, `signature`) => `Promise`\<\{ `error?`: `string`; `event?`: [`WebhookEvent`](../interfaces/WebhookEvent.md); `success`: `boolean`; \}\>

Defined in: server/webhook.ts:206

Create a webhook handler that verifies and processes raw webhook requests.

An invalid signature is never dispatched — `throwOnInvalidSignature` only
controls whether the failure throws (caught here as an error result) or is
returned directly.

## Parameters

### config

[`WebhookConfig`](../interfaces/WebhookConfig.md)

## Returns

(`rawBody`, `signature`) => `Promise`\<\{ `error?`: `string`; `event?`: [`WebhookEvent`](../interfaces/WebhookEvent.md); `success`: `boolean`; \}\>

## Example

```typescript
const handleWebhook = createWebhookProcessor({
  signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
  handlers: { 'CHARGE': async (event) => { await fulfill(event); } },
});
const result = await handleWebhook(rawBody, signature);
```
