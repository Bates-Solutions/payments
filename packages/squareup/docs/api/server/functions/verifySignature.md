[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / verifySignature

# Function: verifySignature()

> **verifySignature**(`rawBody`, `signature`, `signatureKey`, `notificationUrl?`): [`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Defined in: [server/webhook.ts:40](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/webhook.ts#L40)

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
