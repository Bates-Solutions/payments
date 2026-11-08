# Prices & Products

The `prices` and `products` services wrap Stripe [Prices](https://docs.stripe.com/api/prices) and [Products](https://docs.stripe.com/api/products) — for reading your catalog from Stripe and for creating, updating and archiving products and prices.

## List prices with their product

Expand the product inline to read its metadata in one call:

```typescript
const { data: prices } = await stripe.prices.list({
  active: true,
  expandProduct: true,
});

for (const price of prices) {
  const product = price.product as Stripe.Product;
  console.log(product.name, product.metadata.tier);
  console.log(price.unit_amount, price.currency, price.recurring?.interval);
}
```

Metadata passes through untouched, so you can key plans off your own product/price metadata.

Options for `prices.list`:

| Field           | Type      | Description                                        |
| --------------- | --------- | -------------------------------------------------- |
| `active`        | `boolean` | Filter by active/inactive.                         |
| `product`       | `string`  | Only prices for this product.                      |
| `expandProduct` | `boolean` | Expand `price.product` to the full product object. |
| `limit`         | `number`  | Page size.                                         |
| `startingAfter` | `string`  | Pagination cursor.                                 |

## Retrieve a single price or product

```typescript
const price = await stripe.prices.get('price_123', { expandProduct: true });

const product = await stripe.products.get('prod_123');
console.log(product.metadata);
```

## List products

```typescript
const { data: products } = await stripe.products.list({ active: true });
```

## Create a product

```typescript
const product = await stripe.products.create({
  name: 'Sourdough loaf',
  description: 'Naturally leavened',
  images: ['https://example.com/loaf.png'],
  metadata: { sku: 'SD-001' },
});
```

`name` is required and must not be blank. Use `metadata` to tag the product with your own id so a later sync can find it again.

## Update or archive a product

```typescript
await stripe.products.update('prod_123', {
  name: 'Sourdough loaf (large)',
  metadata: { sku: 'SD-002' },
  defaultPriceId: 'price_456',
});

// Archive: it can no longer be bought, but past payments still reference it
await stripe.products.archive('prod_123');

// Restore it later
await stripe.products.update('prod_123', { active: true });
```

Only the fields you pass are changed. `metadata` merges into the existing metadata; set a key to `''` to remove it.

## Create a price

Amounts are integer minor units (cents for `usd`).

```typescript
// One-time price
const price = await stripe.prices.create({
  product: 'prod_123',
  unitAmount: 899,
  currency: 'usd',
  metadata: { sku: 'SD-001' },
});

// Recurring price, billed every 3 months
await stripe.prices.create({
  product: 'prod_123',
  unitAmount: 7500,
  currency: 'usd',
  recurring: { interval: 'month', intervalCount: 3 },
  lookupKey: 'loaf-quarterly',
});
```

`unitAmount` must be a non-negative integer; anything else throws `StripeValidationError` before Stripe is called.

## Change a price

Stripe prices are immutable: the amount, currency and interval can't be edited. `prices.update` changes only the mutable fields (`active`, `nickname`, `lookupKey`, `metadata`), and `prices.archive(id)` deactivates a price.

To change the amount, use `prices.replace`. It creates a new price on the same product, then deactivates the old one:

```typescript
const { price, previous } = await stripe.prices.replace('price_old', {
  unitAmount: 949,
  idempotencyKey: `reprice-${sku}-${version}`,
});
// price.active === true, previous.active === false
```

- Exactly these are copied from the old price unless you pass overrides (`currency`, `recurring`, `nickname`, `metadata`): currency, interval and interval count, nickname, metadata, tax behavior. Nothing else is copied.
- A lookup key moves to the new price (in its own step, after the new price exists).
- If the old price was the product's default price, the new price becomes the default before the old one is deactivated (Stripe won't deactivate a default price).
- The new price is created before the old one is deactivated, so the product always has an active price.
- Retry a failed `replace` with the same `idempotencyKey`. Each step uses a key derived from it, so a retry finishes the remaining steps without creating a second price.
- Only plain per-unit prices in one currency can be replaced. These throw `StripeValidationError` instead of being silently simplified: tiered prices, metered prices (`usage_type: 'metered'` or a meter), customer-chooses-the-amount prices (`custom_unit_amount`), prices with `transform_quantity`, and prices with extra `currency_options`. Replace those with `prices.create` plus `prices.archive`.

Existing subscriptions on the old price keep billing at the old amount. Move them to the new price separately if you need to.
