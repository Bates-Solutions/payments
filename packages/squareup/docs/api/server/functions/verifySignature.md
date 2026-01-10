[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / verifySignature

# Function: verifySignature()

> **verifySignature**(`rawBody`, `signature`, `signatureKey`, `notificationUrl?`): [`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Defined in: [src/server/webhook.ts:38](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/webhook.ts#L38)

Verify a Square webhook signature using HMAC-SHA256

## Parameters

### rawBody

`string`

The raw request body as a string

### signature

`string`

The signature from the x-square-hmacsha256-signature header

### signatureKey

`string`

Your webhook signature key from Square

### notificationUrl?

`string`

The URL where the webhook was sent (optional, for additional verification)

## Returns

[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Verification result with valid flag and optional error

## Example

```typescript
import { verifySignature } from '@bates-solutions/squareup/server';

const result = verifySignature(
  rawBody,
  req.headers['x-square-hmacsha256-signature'],
  process.env.SQUARE_WEBHOOK_KEY!
);

if (!result.valid) {
  return res.status(401).json({ error: result.error });
}
```
