# Subscriptions

The `subscriptions` service wraps Stripe [Subscriptions](https://docs.stripe.com/api/subscriptions). Read methods return a **normalized** subscription with a stable shape across Stripe API versions; the raw object is always on `.raw`.

## Why normalized?

Stripe moved `current_period_start` / `current_period_end` **from the subscription onto the subscription item** in newer API versions. The wrapper reads from the item first and falls back to the subscription, and surfaces both as JS `Date`s — so your code stops caring which API version is pinned and stops doing `new Date(x * 1000)`.

```typescript
const sub = await stripe.subscriptions.retrieve('sub_123');

sub.id;                  // 'sub_123'
sub.status;              // 'active' | 'trialing' | 'past_due' | 'canceled' | …
sub.customerId;          // 'cus_123'
sub.priceId;             // first item's price id
sub.quantity;            // first item's quantity
sub.items;               // [{ id, priceId, quantity }, …]
sub.currentPeriodStart;  // Date
sub.currentPeriodEnd;    // Date
sub.cancelAtPeriodEnd;   // boolean
sub.trialEnd;            // Date | undefined
sub.raw;                 // the full Stripe.Subscription
```

> **Status mapping stays in your app.** The wrapper gives you Stripe's status verbatim; mapping it to your own states (e.g. `active` / `past_due` / `expired`) is business logic that belongs in your code.

## List

```typescript
const { data } = await stripe.subscriptions.list({
  customerId: 'cus_123',
  status: 'active',
  limit: 20,
});
```

## Cancel and resume

```typescript
// Cancel immediately
await stripe.subscriptions.cancel('sub_123');

// Cancel at the end of the current period
await stripe.subscriptions.cancel('sub_123', { atPeriodEnd: true });

// Undo a scheduled cancellation
await stripe.subscriptions.resume('sub_123');
```

## Normalizing an event payload

When a `customer.subscription.*` webhook arrives, normalize the payload without a round-trip:

```typescript
import { normalizeSubscription } from '@bates-solutions/stripe';

const normalized = normalizeSubscription(event.data.object);
```
