[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / verifySignature

# Function: verifySignature()

> **verifySignature**(`rawBody`, `signature`, `signatureKey`, `notificationUrl?`): [`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Defined in: [squareup/src/server/webhook.ts:48](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/webhook.ts#L48)

Verify a Square webhook signature using HMAC-SHA256

## Parameters

### rawBody

`string`

The raw request body as a string

### signature

`string`

The signature from the x-square-hmacsha256-signature header

### signatureKey

[`WebhookSignatureKey`](../type-aliases/WebhookSignatureKey.md)

Your webhook signature key from Square, or a list of keys while you rotate it (any match is valid)

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

// While rotating the key, accept the new and the old one
verifySignature(rawBody, signature, [process.env.SQUARE_WEBHOOK_KEY!, process.env.SQUARE_WEBHOOK_KEY_OLD!]);
```
