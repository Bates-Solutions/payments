# Webhook Subscription Management

`square.webhooks.subscriptions` manages Square webhook **subscriptions** — the registrations that tell Square where to POST events. This is separate from the [webhook verification](./webhooks.md) helpers in `@bates-solutions/squareup/server`, which validate incoming events; here you create and maintain the subscriptions themselves.

Because it runs on the core client (not raw HTTP), it works inside a Lambda handler — e.g. an OAuth "Connect your Square account" flow that provisions a subscription per tenant.

## Create — and persist the signature key

```typescript
const created = await square.webhooks.subscriptions.create({
  name: 'platform-order-events',
  eventTypes: ['payment.updated', 'order.updated', 'refund.updated'],
  notificationUrl: 'https://api.example.com/webhook',
});

created.signatureKey; // present HERE ONLY — persist it immediately
```

> **The signature key is returned only on creation.** A later `get`/`list` never includes it — which is why the types reflect that: `create()` returns a `CreatedWebhookSubscription` (with `signatureKey`), while `get`/`list`/`update` return a `WebhookSubscription` (no `signatureKey`). Store it the moment you create the subscription.

## Idempotent create

Subscriptions aren't deduplicated by URL, so list first if you might re-run:

```typescript
const { data } = await square.webhooks.subscriptions.list();
const existing = data.find((s) => s.notificationUrl === url);
if (!existing) {
  await square.webhooks.subscriptions.create({ name, eventTypes, notificationUrl: url });
}
```

## List, get, update, delete

```typescript
const { data, cursor } = await square.webhooks.subscriptions.list({ includeDisabled: true });

const sub = await square.webhooks.subscriptions.get('wbhk_123');

await square.webhooks.subscriptions.update('wbhk_123', {
  eventTypes: ['payment.updated'],
  enabled: false,
});

await square.webhooks.subscriptions.delete('wbhk_123');
```

## Test the endpoint

Send a test event to verify a connection (e.g. behind a "verify" button):

```typescript
const result = await square.webhooks.subscriptions.test('wbhk_123', { eventType: 'payment.created' });
result.statusCode;   // your endpoint's HTTP response
result.passesFilter; // whether the event matched the subscription's filters
```

## Recover a lost key by rotating

If the create-time `signatureKey` wasn't persisted, rotate to get a fresh one — no delete/recreate needed:

```typescript
const { signatureKey } = await square.webhooks.subscriptions.rotateSignatureKey('wbhk_123');
```

Rotating **invalidates the previous key**, so deploy the new one before Square signs the next delivery with it.
