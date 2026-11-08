# Payment Links

The `paymentLinks` service reads Stripe [Payment Links](https://docs.stripe.com/api/payment-link).

```typescript
const link = await stripe.paymentLinks.get('plink_123');

// What the link offers (every page, fetched for you)
const offered = await stripe.paymentLinks.listLineItems('plink_123', { expandProduct: true });
```

## What was sold through a link

A Payment Link's own line items are what it offers, not what was bought. Each purchase through a link creates a Checkout Session, so read sales from those:

```typescript
let cursor: string | undefined;
do {
  const page = await stripe.checkout.list({
    paymentLinkId: 'plink_123',
    status: 'complete',
    created: { gte: new Date('2026-03-01') },
    limit: 100,
    startingAfter: cursor,
  });

  for (const session of page.data) {
    const items = await stripe.checkout.listLineItems(session.id);
  }

  cursor = page.nextCursor; // list returns one page; follow the cursor
} while (cursor);
```

See [Checkout: reading what was sold](./checkout.md#reading-what-was-sold).
