[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / SubscriptionUpdatedEvent

# Type Alias: SubscriptionUpdatedEvent

> **SubscriptionUpdatedEvent** = `Extract`\<`Stripe.Event`, \{ `type`: `"customer.subscription.updated"`; \}\>

<<<<<<< HEAD
Defined in: [server/types.ts:75](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L75)
=======
Defined in: [server/types.ts:75](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L75)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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
