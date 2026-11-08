# Checkout

The `checkout` service wraps Stripe [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions) — the hosted page where customers subscribe or pay.

## Create a session

```typescript
const session = await stripe.checkout.create({
  mode: 'subscription', // default; also 'payment' or 'setup'
  customerId: 'cus_123',
  lineItems: [{ price: 'price_123', quantity: 1 }],
  successUrl: 'https://app.example.com/billing?success=true',
  cancelUrl: 'https://app.example.com/billing?canceled=true',
  metadata: { user_id: 'u_123' },
});

// Redirect the customer to complete the flow
redirect(session.url);
```

Options:

| Field               | Type                        | Description                                                  |
| ------------------- | --------------------------- | ------------------------------------------------------------ |
| `lineItems`         | `{ price, quantity? }[]`    | **Required.** Prices to purchase.                            |
| `successUrl`        | `string`                    | **Required.** Redirect on success.                          |
| `cancelUrl`         | `string`                    | **Required.** Redirect on cancel.                           |
| `mode`              | `'subscription' \| 'payment' \| 'setup'` | Defaults to `subscription`.                    |
| `customerId`        | `string`                    | Existing customer to attach.                                |
| `customerEmail`     | `string`                    | Prefill email for a new customer (ignored if `customerId`). |
| `clientReferenceId` | `string`                    | Your own reference, echoed back on the session.             |
| `metadata`          | `Record<string, string>`    | Arbitrary metadata.                                         |

Missing `lineItems`, `successUrl`, or `cancelUrl` throws a `StripeValidationError`.

## Retrieve, expire, and list

```typescript
const session = await stripe.checkout.get('cs_123');

// Stop an open session from being completed
await stripe.checkout.expire('cs_123');

// List, optionally filtered by customer or subscription
const { data } = await stripe.checkout.list({ customerId: 'cus_123' });
```

## Reading what was sold

Filter to completed sessions in a time window, then read each session's line items. `created` bounds accept a `Date` or whole Unix seconds (`gte`, `gt`, `lte`, `lt`); a number that looks like milliseconds throws `StripeValidationError`.

`list` returns one page (up to `limit`, max 100), so follow `nextCursor` until it is `undefined`, or a busy month is undercounted:

```typescript
let cursor: string | undefined;
do {
  const page = await stripe.checkout.list({
    status: 'complete',
    created: { gte: new Date('2026-03-01'), lt: new Date('2026-04-01') },
    limit: 100,
    startingAfter: cursor,
  });

  for (const session of page.data) {
    const items = await stripe.checkout.listLineItems(session.id, { expandProduct: true });
    for (const item of items) {
      const product = item.price?.product as Stripe.Product;
      console.log(product.metadata.sku, item.quantity, item.amount_total);
    }
  }

  cursor = page.nextCursor;
} while (cursor);
```

`listLineItems` fetches every page for you and returns a plain array. `expandProduct` expands `price.product` so you can read your own product metadata.

`list` options for sales:

| Field             | Type                                | Description                                                       |
| ----------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `status`          | `'open' \| 'complete' \| 'expired'` | `'complete'` for finished sales.                                  |
| `created`         | `TimeRange`                         | Only sessions created in this window.                             |
| `paymentLinkId`   | `string`                            | Only sessions created from this Payment Link.                     |
| `expandLineItems` | `boolean`                           | Expand `line_items` inline. Only the first page of items is included; use `listLineItems` for all of them. |

Sales through a [Payment Link](./payment-links.md) are Checkout Sessions too, so the same calls cover them (filter with `paymentLinkId`).

In-person Terminal payments carry no line items; Checkout Sessions, Payment Links and invoices are the sources.

## Reacting to completion

A completed session fires a `checkout.session.completed` webhook. See the [Webhooks guide](../server/webhooks.md) — pair it with `subscriptions.get` to read the resulting subscription.
