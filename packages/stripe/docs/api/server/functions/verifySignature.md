[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / verifySignature

# Function: verifySignature()

> **verifySignature**(`rawBody`, `signature`, `signingSecret`, `options?`): `Promise`\<[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)\>

Defined in: [server/webhook.ts:105](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/server/webhook.ts#L105)

Verify a Stripe webhook signature.

Reimplements Stripe's signing scheme (HMAC-SHA256 over `${timestamp}.${body}`)
using WebCrypto, so verification needs neither a Stripe SDK instance, a network
call, nor any Node built-in — it runs on Node 20+, Deno, Bun, and Workers.

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
