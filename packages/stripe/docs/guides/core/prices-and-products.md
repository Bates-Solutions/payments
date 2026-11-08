# Prices & Products

The `prices` and `products` services wrap Stripe [Prices](https://docs.stripe.com/api/prices) and [Products](https://docs.stripe.com/api/products) — useful when Stripe is the source of truth for your plan catalog.

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
