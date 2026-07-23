[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / verifySignature

# Function: verifySignature()

> **verifySignature**(`rawBody`, `signature`, `signingSecret`, `options?`): `Promise`\<[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)\>

Defined in: server/webhook.ts:91

Verify a Clover Hosted-Checkout webhook signature.

Clover signs `${timestamp}.${rawBody}` with HMAC-SHA256 and sends it in the
`clover-signature` header as `t=<ts>,v1=<sig>`. This reimplements that scheme
with WebCrypto — no SDK, no network, no Node built-ins.

## Parameters

### rawBody

`string`

The raw request body as a string

### signature

`string`

The `clover-signature` header value

### signingSecret

`string`

Your webhook signing secret

### options?

[`VerifyOptions`](../interfaces/VerifyOptions.md)

Verification options (timestamp tolerance)

## Returns

`Promise`\<[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)\>

## Example

```typescript
const result = await verifySignature(rawBody, signature, process.env.CLOVER_WEBHOOK_SECRET!);
if (!result.valid) return res.status(400).json({ error: result.error });
```
