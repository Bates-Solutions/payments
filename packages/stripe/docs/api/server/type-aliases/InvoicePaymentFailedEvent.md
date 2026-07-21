[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / InvoicePaymentFailedEvent

# Type Alias: InvoicePaymentFailedEvent

> **InvoicePaymentFailedEvent** = `Extract`\<`Stripe.Event`, \{ `type`: `"invoice.payment_failed"`; \}\>

Defined in: [server/types.ts:78](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/server/types.ts#L78)

@bates-solutions/stripe/server

Server utilities for handling Stripe webhooks.

## Example

```typescript
// Next.js App Router
import { createNextWebhookHandler } from '@bates-solutions/stripe/server';

export const POST = createNextWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
});
```
