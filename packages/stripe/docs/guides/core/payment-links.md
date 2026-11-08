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
const { data: sessions } = await stripe.checkout.list({
  paymentLinkId: 'plink_123',
  status: 'complete',
  created: { gte: new Date('2026-03-01') },
});

for (const session of sessions) {
  const items = await stripe.checkout.listLineItems(session.id);
}
```

See [Checkout: reading what was sold](./checkout.md#reading-what-was-sold).
