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

## Reacting to completion

A completed session fires a `checkout.session.completed` webhook. See the [Webhooks guide](../server/webhooks.md) — pair it with `subscriptions.retrieve` to read the resulting subscription.
