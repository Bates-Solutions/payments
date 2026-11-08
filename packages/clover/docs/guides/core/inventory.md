# Inventory

The `inventory` service wraps Clover's Platform [inventory](https://docs.clover.com/dev/reference/inventorygetitems) API: items (`/v3/merchants/{mId}/items`) and their stock (`/v3/merchants/{mId}/item_stocks/{itemId}`). It **requires a `merchantId`** on the client. Prices and costs are integer cents.

## Find items by barcode or SKU

`findItemsByCode()` looks items up by product code (UPC / EAN barcode, the item `code`) or `sku`, without listing the whole inventory. It pages through every match and returns each item once.

```typescript
const items = await clover.inventory.findItemsByCode({
  codes: ['012345678905'],
  skus: ['PICKLE-DILL-500'],
  expand: ['itemStock'], // include stock levels
});

for (const item of items) {
  console.log(item.name, item.code, item.itemStock?.quantity);
}
```

- Codes are matched exactly and are not normalized: a UPC-A `012345678905` won't find the same barcode stored as EAN-13 `0012345678905`. Pass both forms if the merchant may have either.
- It makes one request per code, so pass a few hundred codes at most per call.
- At least one non-blank code or SKU is required.

## List and get

`listItems()` uses offset pagination (Clover allows up to 1000 per page). `filter` takes raw Clover filters, which are combined with AND; see [Applying filters](https://docs.clover.com/docs/applying-filters).

```typescript
const { data } = await clover.inventory.listItems({
  filter: ['hidden=false'],
  expand: ['itemStock', 'categories'],
  limit: 100,
  offset: 0,
});

const item = await clover.inventory.getItem('ITEM_1', { expand: ['itemStock'] });
```

Expand `itemStock` to get `item.itemStock.quantity`. The top-level `stockCount` is deprecated by Clover.

## Create and update items

```typescript
const item = await clover.inventory.createItem({
  name: 'Dill pickles 500 ml',
  price: 599, // $5.99
  sku: 'PICKLE-DILL-500',
  code: '012345678905',
});

await clover.inventory.updateItem(item.id!, { price: 649 });
```

`name` and `price` are required to create. `updateItem()` sends only the fields you give, and needs at least one. Both throw `CloverValidationError` for a non-integer or negative `price` / `cost`. Neither changes stock.

## Item stock

```typescript
const { quantity = 0 } = await clover.inventory.getItemStock('ITEM_1');

// quantity replaces the current count: add a delivery by sending the new total
await clover.inventory.updateItemStock('ITEM_1', { quantity: quantity + 24 });
```

`quantity` can be fractional for items sold by weight or measure. A non-finite `quantity` throws `CloverValidationError`.
