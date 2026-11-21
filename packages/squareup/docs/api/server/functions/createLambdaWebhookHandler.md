[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / createLambdaWebhookHandler

# Function: createLambdaWebhookHandler()

> **createLambdaWebhookHandler**(`config`): (`proxyEvent`) => `Promise`\<[`LambdaProxyResult`](../interfaces/LambdaProxyResult.md)\>

Defined in: [squareup/src/server/middleware/lambda.ts:169](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L169)

Create an AWS Lambda handler for Square webhooks

Handles CORS preflight, signature verification, event parsing,
routing to handlers, and entity ID extraction.

Responses:
- `204` for a CORS preflight (`OPTIONS`)
- `400` when the body is missing or is not JSON
- `401` when the signature header is missing or the signature is invalid
- `500` when a handler (or `onUnhandledEvent`) throws, so Square retries the delivery
- `200` with `{ success: true, eventId, ...ids }` once the handler has run

Square retries a delivery that fails, so make handlers idempotent (for
example, keyed on `event.event_id`).

## Parameters

### config

[`LambdaWebhookConfig`](../interfaces/LambdaWebhookConfig.md)

Lambda webhook configuration

## Returns

Lambda handler function

(`proxyEvent`) => `Promise`\<[`LambdaProxyResult`](../interfaces/LambdaProxyResult.md)\>

## Throws

When `notificationUrl` is missing

## Example

```typescript
import { createLambdaWebhookHandler } from '@bates-solutions/squareup/server';

export const handler = createLambdaWebhookHandler({
  signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
  notificationUrl: 'https://api.example.com/webhooks/square',
  handlers: {
    'payment.completed': async (event, context) => {
      await processPayment(event.data.id, context.orderId);
    },
  },
});
```
