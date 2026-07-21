[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / verifySignature

# Function: verifySignature()

> **verifySignature**(`rawBody`, `signature`, `signingSecret`, `options?`): `Promise`\<[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)\>

Defined in: [server/webhook.ts:108](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/server/webhook.ts#L108)

Verify a Stripe webhook signature.

Reimplements Stripe's signing scheme (HMAC-SHA256 over `${timestamp}.${body}`)
using WebCrypto, so verification needs neither a Stripe SDK instance, a network
call, nor any Node built-in — it runs on Node 22+, Deno, Bun, and Workers.

## Parameters

### rawBody

`string`

The raw request body as a string

### signature

`string`

The `stripe-signature` header value

### signingSecret

`string`

Your webhook signing secret (`whsec_…`)

### options?

[`VerifyOptions`](../interfaces/VerifyOptions.md)

Verification options (timestamp tolerance)

## Returns

`Promise`\<[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)\>

Verification result with a `valid` flag and optional error

## Example

```typescript
import { verifySignature } from '@bates-solutions/stripe/server';

const result = await verifySignature(
  rawBody,
  req.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET!
);

if (!result.valid) {
  return res.status(400).json({ error: result.error });
}
```
