# WellPlated Requirements for `@bates-solutions/stripe`

> **Purpose of this doc:** WellPlated is the first real consumer of this library. This
> is the prioritized list of what WellPlated needs from the wrapper, mapped against
> what the library ships today, so the roadmap can be driven by a concrete integration
> target rather than guesswork. Everything here is derived from WellPlated's in-flight
> Stripe work (Plan 21, draft PRs #207–#209) plus its merged subscription/entitlement
> schema.
>
> _Authored 2026-07-20 from a read-only review of both codebases. Library state
> reflects the `stripe` project at that date (v0.0.0)._

---

## 1. Context — how WellPlated uses Stripe

- **WellPlated is subscription-only.** Provider billing is a **web/Stripe** rail
  (deliberately off the App Store to avoid Apple's cut; caregivers bill via RevenueCat
  IAP, which does **not** touch this library). There are **no one-time payments, no
  Elements, no native mobile SDK** — the app opens a hosted Checkout / Portal URL.
- **The backend is Supabase Edge Functions = Deno, not Node.** WellPlated already
  imports Stripe in Deno via `https://esm.sh/stripe@17?target=deno` and verifies
  webhooks with `stripe.webhooks.constructEventAsync(...)`. Any part of this library
  WellPlated consumes **must run under Deno / a Web-standard (fetch + WebCrypto)
  runtime**, not just Node.
- **What WellPlated hand-rolled today** (the code this library is meant to replace):
  a `_shared/stripe-client.ts` singleton, and five edge functions —
  `create-checkout`, `create-portal`, `subscription-plans`, `subscription-status`,
  `stripe-webhook`. The wrapper should let those functions drop the raw SDK calls and
  the repetitive glue (customer string-vs-object narrowing, Unix-epoch→Date conversion,
  Stripe-status→app-status mapping).

### The single most important constraint

> **Edge/Deno runtime support is a hard requirement, not a nice-to-have.** The library's
> current `./server` module is Node-only: it uses `import { createHmac } from 'crypto'`
> and ships only Express / Next.js / Lambda adapters. WellPlated cannot use any of those.
> Without an edge-compatible webhook path (Web `Request`→`Response`, async signature
> verification), WellPlated can only use the **core** services and will keep hand-rolling
> its webhook. See P0-6.

---

## 2. Priority overview

| Priority | Item | Library today | Blocking WellPlated? |
|---|---|---|---|
| **P0-1** | `checkout` service (Checkout Sessions) | ❌ missing | Yes — no subscribe flow without it |
| **P0-2** | `billingPortal` service | ❌ missing | Yes — no self-service management |
| **P0-3** | `subscriptions` service (retrieve + status) | ❌ missing | Yes — webhook needs `subscriptions.retrieve` |
| **P0-4** | `prices` + `products` (list w/ expand + metadata) | ❌ missing | Yes — plans are read from Stripe |
| **P0-5** | `customers` (create + retrieve) | ✅ **exists** | No — verify only |
| **P0-6** | **Edge/Deno webhook path** (async verify + Web adapter) | ❌ Node-only | Yes — see constraint above |
| **P1-7** | Typed webhook events for the subscription lifecycle | ⚠️ partial | Degraded DX without it |
| **P1-8** | Webhook value helpers (ID narrowing, epoch→Date) | ⚠️ partial | Quality-of-life |
| **P2** | payments, refunds, Connect, tax, metering-via-usage-records | mixed | **Not needed by WellPlated** |

WellPlated's minimum viable dependency is **P0-1 through P0-6**. Until those land it will
keep its hand-rolled edge functions.

---

## 3. P0 — required for WellPlated to adopt the library

### P0-1 — `checkout` service (Checkout Sessions)

WellPlated's `create-checkout` edge function does:

```ts
const session = await stripe.checkout.sessions.create({
  customer: stripeCustomerId,
  mode: 'subscription',
  line_items: [{ price: price_id, quantity: 1 }],
  success_url: `${baseUrl}/menu/subscriptions?success=true`,
  cancel_url:  `${baseUrl}/menu/subscriptions?canceled=true`,
  metadata: { user_id: user.id },
});
// uses session.url
```

**Need:** a `client.checkout.sessions.create(...)` (or `client.checkout.create(...)`)
wrapper supporting at minimum: `customer`, `mode: 'subscription'`, `line_items`
(price + quantity), `success_url`, `cancel_url`, `metadata`. Return the created session
(or at least `{ id, url }`) normalized like the other services.

**Acceptance:** WellPlated's `create-checkout` can be rewritten to a single wrapper call
returning `session.url`, with validation errors surfaced as `StripeValidationError`.

### P0-2 — `billingPortal` service

`create-portal` does:

```ts
const session = await stripe.billingPortal.sessions.create({
  customer: sub.stripe_customer_id,
  return_url: returnUrl,
});
// uses session.url
```

**Need:** `client.billingPortal.sessions.create({ customer, returnUrl })` → normalized
session with `url`.

### P0-3 — `subscriptions` service

The webhook retrieves the full subscription to read price + period on
`checkout.session.completed`:

```ts
const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
subscription.items.data[0]?.price.id
subscription.current_period_start   // unix seconds
subscription.current_period_end
subscription.cancel_at_period_end
subscription.status
```

**Need:** `client.subscriptions.retrieve(id)` returning a normalized `Subscription` that
exposes (at least): `id`, `status`, `items` (with `price.id`), `currentPeriodStart`,
`currentPeriodEnd`, `cancelAtPeriodEnd`, `customer`. Prefer surfacing period fields as
**JS `Date`s** (see P1-8) so consumers stop doing `new Date(x * 1000)`.

> **Note for the library author:** WellPlated pins `apiVersion` where
> `current_period_start/end` live on the **subscription**. In newer Stripe API versions
> these moved onto the **subscription item**. The wrapper should normalize this so
> consumers get a stable shape regardless of pinned version — this is exactly the kind
> of churn the wrapper exists to absorb.

### P0-4 — `prices` + `products`

`subscription-plans` reads the catalog from Stripe (Stripe = source of truth for pricing):

```ts
const prices = await stripe.prices.list({ active: true, expand: ['data.product'] });
// then filter product.metadata.app === 'wellplated', read product.metadata.tier/features/highlight,
// price.unit_amount, price.recurring.interval
```

**Need:** `client.prices.list({ active, expand })` returning normalized prices with the
**expanded product** accessible (name, description, metadata). A convenience for
"list active prices with product expanded" would let WellPlated drop the manual expand.
Metadata must pass through untouched (WellPlated keys off `app`, `tier`, `features`,
`highlight`).

### P0-5 — `customers` (create + retrieve) — **verify, likely already done**

`create-checkout` creates a customer when none exists:

```ts
const customer = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
```

The library already ships `CustomersService` with `create` / `get` / `update` / `list` /
`search`. **Action: confirm** `create` accepts `email` + `metadata` and `get(id)` works
for WellPlated's needs. No new work expected.

### P0-6 — Edge/Deno-compatible webhook path — **the load-bearing gap**

WellPlated's `stripe-webhook` function:

```ts
const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
switch (event.type) {
  case 'checkout.session.completed':      /* activate */ break;
  case 'customer.subscription.updated':   /* sync status/period */ break;
  case 'customer.subscription.deleted':   /* mark canceled */ break;
  case 'invoice.payment_failed':          /* mark past_due */ break;
}
```

The library's `./server` module today is **Node-only** (`createHmac` from `crypto`;
Express/Next/Lambda adapters). WellPlated needs:

1. **Async signature verification** that runs on WebCrypto/Deno — either wrap Stripe's
   `constructEventAsync` (recommended; Stripe owns the correctness) or provide a
   SubtleCrypto-based verify. The current synchronous Node `createHmac` path will not
   serve edge consumers.
2. **A Web-standard adapter** — a handler that takes a Web `Request` and returns a Web
   `Response` (the existing Next.js App-Router adapter is close; a framework-neutral
   `createWebhookHandler` / Deno `Deno.serve` shape is what's needed). It must read the
   raw body via `await request.text()` and the `stripe-signature` header.
3. **Same typed-handler-map dispatch** the library already uses (`handlers: { [type]: fn }`),
   so WellPlated replaces its `switch` with a config object.

**Acceptance:** WellPlated's `stripe-webhook` edge function can be rewritten as a
`createWebhookHandler({ signingSecret, handlers: { ... } })` that runs inside
`Deno.serve` with no Node built-ins, verifying signatures via WebCrypto.

---

## 4. P1 — strongly wanted, not strictly blocking

### P1-7 — Typed webhook events for the subscription lifecycle

WellPlated dispatches on these event types (must be in `WebhookEventType` with typed
`event.data.object` payloads):

- `checkout.session.completed` → Checkout Session (needs `mode`, `customer`, `subscription`)
- `customer.subscription.updated` → Subscription (status, items[].price.id, period, cancel_at_period_end)
- `customer.subscription.deleted` → Subscription
- `invoice.payment_failed` → Invoice (needs `customer`)
- `invoice.paid` → Invoice _(WellPlated's issue #205 lists this; not yet in the draft handler — include for completeness)_

Today `server/types.ts` only demonstrates `payment_intent.succeeded`. Expand the typed
event union to cover the above so consumers get `event.data.object` typed without casts.

### P1-8 — Webhook value helpers

Repeated glue in WellPlated's webhook that the library should own:

- **ID narrowing:** `typeof x.customer === 'string' ? x.customer : x.customer.id` appears
  ~6 times. Provide `getCustomerId(event)` (exists ✅) plus `getSubscriptionId(event)` and
  a generic `resolveId(stringOrObject)` helper.
- **Epoch→Date:** `new Date(sec * 1000).toISOString()` repeated. Provide a `fromUnixTime`/
  normalized `Date` on subscription/invoice entities (ties into P0-3).
- **Status mapping is business logic** (Stripe status → WellPlated's `trialing/active/
  past_due/canceled/expired`) and should **stay in WellPlated**, not the library. The
  library should give clean typed inputs; the mapping is app-specific.

---

## 5. Explicitly NOT needed by WellPlated

So the library roadmap isn't skewed toward things WellPlated won't exercise:

- **PaymentIntents / one-time payments** (`payments` service) — WellPlated is
  subscription-only. Fine to keep for the library's broader audience; not a WellPlated
  blocker.
- **Refunds** — not used by WellPlated.
- **Stripe Elements / Payment Element / `@stripe/*` frontend / native SDK** — WellPlated
  uses hosted Checkout + Portal via a URL open. No client-side Stripe at all.
- **Connect, Terminal, Tax, Issuing, Stripe Entitlements API** — none used. (WellPlated
  has its own `get_my_entitlement()` RPC; unrelated to Stripe Entitlements.)
- **Metered usage via `usageRecords`** — issue #205 mentions per-client metered billing,
  but the current draft implementation does **not** send usage records; it's aspirational.
  Treat as future/P2, not part of the initial WellPlated integration.

---

## 6. Integration map (library → WellPlated edge function)

Once P0 lands, WellPlated's edge functions collapse to:

| WellPlated edge function | Replace raw SDK with |
|---|---|
| `_shared/stripe-client.ts` | `createStripeClient({ apiKey, apiVersion })` (Deno import) |
| `create-checkout` | `client.customers.create/get` + `client.checkout.sessions.create` |
| `create-portal` | `client.billingPortal.sessions.create` |
| `subscription-plans` | `client.prices.list({ active, expand })` |
| `subscription-status` | reads DB only — **no library dependency** |
| `stripe-webhook` | `createWebhookHandler({ signingSecret, handlers })` (edge adapter) + `client.subscriptions.retrieve` |
| `_shared/subscription-guard.ts` | **stays as-is** — WellPlated business logic |

---

## 7. Open question WellPlated must settle (not a library task)

WellPlated currently has **two conflicting subscription data models**, and the library
should stay agnostic to which wins (it only produces verified, typed events + normalized
entities; WellPlated writes them wherever it lands):

- **Plan 21 drafts (March 2026, PRs #207–#209):** `provider_subscriptions` table,
  inline `subscription-guard.ts`, 5 tiers (`trial/founding_partner/professional/clinic/
  enterprise`), $79 Professional, 30-day trial via DB trigger.
- **Merged schema (July 2026, `20260714004250_subscriptions_entitlements.sql`):**
  `subscriptions` table + `get_my_entitlement()` RPC, `source IN ('comp','stripe','iap')`,
  early-access default, single $49 Professional plan.

These diverge (table name, tier set, price). WellPlated should reconcile them before
wiring the library in, so the integration targets the model that actually ships. **This
is a WellPlated decision — no action required from the library.**
