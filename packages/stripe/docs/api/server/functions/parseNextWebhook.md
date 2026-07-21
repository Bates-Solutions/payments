[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseNextWebhook

# Function: parseNextWebhook()

> **parseNextWebhook**(`request`, `signingSecret`, `options?`): `Promise`\<`Event`\>

Defined in: [server/middleware/nextjs.ts:171](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/middleware/nextjs.ts#L171)

Verify and parse a webhook event from a Next.js request.

Use this when you want custom handling instead of automatic processing.

## Parameters

### request

`Request`

The incoming request

### signingSecret

`string`

Your webhook signing secret

### options?

[`VerifyOptions`](../interfaces/VerifyOptions.md)

Verification options

## Returns

`Promise`\<`Event`\>

The parsed webhook event

## Throws

Error if verification fails

## Example

```typescript
// app/api/webhook/route.ts
import { parseNextWebhook } from '@bates-solutions/stripe/server';

export async function POST(request: Request) {
  const event = await parseNextWebhook(request, process.env.STRIPE_WEBHOOK_SECRET!);
  switch (event.type) {
    case 'payment_intent.succeeded':
      // ...
  }
  return Response.json({ received: true });
}
```
