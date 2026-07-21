[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseNextWebhook

# Function: parseNextWebhook()

> **parseNextWebhook**(`request`, `signingSecret`, `options?`): `Promise`\<`Event`\>

<<<<<<< HEAD
Defined in: [server/middleware/nextjs.ts:171](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/nextjs.ts#L171)
=======
Defined in: [server/middleware/nextjs.ts:171](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/nextjs.ts#L171)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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
