# Webhook Handling

Server utilities live in the `@bates-solutions/stripe/server` entrypoint. They verify Stripe's webhook signature and route events to typed handlers — no Stripe SDK instance or network call required for verification.

## Runtime support

Verification uses **WebCrypto** (`globalThis.crypto.subtle`), not Node's `crypto` module, so it runs on **Node 22+, Deno, Bun, and Cloudflare Workers**. See [`createWebhookHandler`](#framework-neutral-edge--deno) for a runtime-neutral handler. The Express and AWS Lambda adapters are Node-targeted (they use `Buffer`/streams).

## Signature verification

Stripe signs each webhook with an HMAC-SHA256 over `${timestamp}.${rawBody}`, sent in the `stripe-signature` header. `verifySignature` reimplements that scheme and is **async** (WebCrypto):

```typescript
import { verifySignature } from '@bates-solutions/stripe/server';

const result = await verifySignature(
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

const { event } = await parseAndVerifyWebhook(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
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
import {
  getPaymentIntentId,
  getChargeId,
  getCustomerId,
  getSubscriptionId,
  resolveId,
} from '@bates-solutions/stripe/server';

getPaymentIntentId(event); // works on payment_intent.* and charge.* events
getChargeId(event);
getCustomerId(event);      // works on customer.* events and any object with a customer
getSubscriptionId(event);  // works on customer.subscription.* and objects referencing a subscription

// Collapse an "id string OR expanded object" reference to its id
resolveId(event.data.object.customer); // 'cus_…'
```

For Stripe's Unix-seconds timestamps, `fromUnixTime(seconds)` (from the core `@bates-solutions/stripe` entrypoint) returns a JS `Date`.

## Framework-neutral (edge / Deno)

`createWebhookHandler` takes a Web `Request` and returns a Web `Response` using only Web APIs — it runs on Deno (`Deno.serve`), Cloudflare Workers, Bun, edge functions, and Next.js App Router:

```typescript
// Supabase Edge Function / Deno
import { createWebhookHandler } from '@bates-solutions/stripe/server';

const handler = createWebhookHandler({
  signingSecret: Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
  handlers: {
    'checkout.session.completed': async (event) => {
      await activateSubscription(event.data.object);
    },
    'customer.subscription.updated': async (event) => {
      await syncSubscription(event.data.object);
    },
    'invoice.payment_failed': async (event) => {
      await markPastDue(event.data.object);
    },
  },
});

Deno.serve(handler);
```

## Framework integration (Node)

See the [Middleware guide](./middleware.md) for ready-made Express, Next.js, and AWS Lambda handlers.
