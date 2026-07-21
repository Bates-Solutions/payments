# Webhook Handling

Server utilities live in the `@bates-solutions/stripe/server` entrypoint. They verify Stripe's webhook signature and route events to typed handlers — no Stripe SDK instance or network call required for verification.

## Signature verification

Stripe signs each webhook with an HMAC-SHA256 over `${timestamp}.${rawBody}`, sent in the `stripe-signature` header. `verifySignature` reimplements that scheme:

```typescript
import { verifySignature } from '@bates-solutions/stripe/server';

const result = verifySignature(
  rawBody,
  req.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET!
);

if (!result.valid) {
  return res.status(400).json({ error: result.error });
}
```

By default the timestamp must be within 300 seconds of now. Pass `{ tolerance: 0 }` to disable that check, or another value to change the window.

> **Always verify against the raw request body.** Re-serializing parsed JSON changes the bytes and breaks the signature.

## Verify and parse in one step

```typescript
import { parseAndVerifyWebhook } from '@bates-solutions/stripe/server';

const { event } = parseAndVerifyWebhook(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
console.log(event.type); // e.g. 'payment_intent.succeeded'
```

## Typed events

`WebhookEvent` is Stripe's own `Event` type — a discriminated union on `type`. Handlers registered by type receive the correctly narrowed `event.data.object`:

```typescript
import { createWebhookProcessor } from '@bates-solutions/stripe/server';

const process = createWebhookProcessor({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      // event.data.object is a Stripe.PaymentIntent here
      await fulfillOrder(event.data.object.id);
    },
    'customer.created': async (event) => {
      // event.data.object is a Stripe.Customer here
      console.log(event.data.object.email);
    },
  },
});

const result = await process(rawBody, signature);
```

## Entity extractors

Pull common IDs off any event without narrowing by hand:

```typescript
import { getPaymentIntentId, getChargeId, getCustomerId } from '@bates-solutions/stripe/server';

getPaymentIntentId(event); // works on payment_intent.* and charge.* events
getChargeId(event);
getCustomerId(event);      // works on customer.* events and any object with a customer
```

## Framework integration

See the [Middleware guide](./middleware.md) for ready-made Express, Next.js, and AWS Lambda handlers.
