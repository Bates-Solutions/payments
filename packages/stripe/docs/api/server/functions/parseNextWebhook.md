[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseNextWebhook

# Function: parseNextWebhook()

> **parseNextWebhook**(`request`, `signingSecret`, `options?`): `Promise`\<`Event`\>

Defined in: [server/middleware/nextjs.ts:175](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/server/middleware/nextjs.ts#L175)

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
