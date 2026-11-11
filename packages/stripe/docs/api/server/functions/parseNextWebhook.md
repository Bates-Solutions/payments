[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseNextWebhook

# Function: parseNextWebhook()

> **parseNextWebhook**(`request`, `signingSecret`, `options?`): `Promise`\<`Event`\>

Defined in: [server/middleware/nextjs.ts:175](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/middleware/nextjs.ts#L175)

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
