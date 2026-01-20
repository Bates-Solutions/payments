# Managing the Catalog

This guide covers how to manage your product catalog using the Square API with `@bates-solutions/squareup`.

## Prerequisites

- Square account with API credentials
- `@bates-solutions/squareup` installed
- Access token from Square Developer Dashboard

## Setup

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
});
```

## Catalog Object Types

| Type | Description |
|------|-------------|
| `ITEM` | Products or services you sell |
| `ITEM_VARIATION` | Size/color variants of an item |
| `CATEGORY` | Groupings for items |
| `DISCOUNT` | Percentage or fixed discounts |
| `TAX` | Tax rates |
| `MODIFIER` | Add-ons (e.g., extra shot) |
| `MODIFIER_LIST` | Groups of modifiers |
| `IMAGE` | Product images |
| `CUSTOM_ATTRIBUTE_DEFINITION` | Custom attribute definitions for items |

## Creating Items

Items in Square always have at least one variation (for price and inventory tracking).

### Simple Item

```typescript
const item = await square.catalog.createItem({
  name: 'Coffee',
  variations: [
    { name: 'Regular', price: 350 }, // $3.50
  ],
});

console.log('Item ID:', item.id);
```

### Item with Multiple Variations

```typescript
const item = await square.catalog.createItem({
  name: 'Latte',
  description: 'Espresso with steamed milk',
  variations: [
    { name: 'Small', price: 400, sku: 'LATTE-S' },
    { name: 'Medium', price: 500, sku: 'LATTE-M' },
    { name: 'Large', price: 600, sku: 'LATTE-L' },
  ],
});

// Access variations
const variations = item.itemData?.variations;
console.log('Variations:', variations?.length);
```

### Item in a Category

```typescript
// First create a category
const category = await square.catalog.createCategory({
  name: 'Hot Drinks',
});

// Then create item in that category
const item = await square.catalog.createItem({
  name: 'Cappuccino',
  categoryId: category.id,
  variations: [
    { name: 'Regular', price: 450 },
  ],
});
```

## Creating Categories

```typescript
const category = await square.catalog.createCategory({
  name: 'Beverages',
});

console.log('Category ID:', category.id);
```

## Getting Catalog Objects

```typescript
const item = await square.catalog.get('ITEM_123');

console.log('Name:', item.itemData?.name);
console.log('Description:', item.itemData?.description);

// Get variation prices
for (const variation of item.itemData?.variations ?? []) {
  const price = variation.itemVariationData?.priceMoney?.amount;
  console.log(`${variation.itemVariationData?.name}: $${Number(price) / 100}`);
}
```

## Searching the Catalog

### Search by Text

```typescript
const { data: items } = await square.catalog.search({
  objectTypes: ['ITEM'],
  query: 'coffee',
});

for (const item of items) {
  console.log(item.itemData?.name);
}
```

### Get All Categories

```typescript
const { data: categories } = await square.catalog.search({
  objectTypes: ['CATEGORY'],
});

for (const category of categories) {
  console.log(category.id, category.categoryData?.name);
}
```

### Search with Pagination

```typescript
let cursor: string | undefined;
const allItems: CatalogObject[] = [];

do {
  const { data, cursor: nextCursor } = await square.catalog.search({
    objectTypes: ['ITEM'],
    limit: 100,
    cursor,
  });

  allItems.push(...data);
  cursor = nextCursor;
} while (cursor);

console.log('Total items:', allItems.length);
```

## Listing Catalog Objects

The `list()` method automatically paginates through all results from the Square API:

```typescript
// List all items (fetches all pages automatically)
const items = await square.catalog.list('ITEM');

// List with a limit (stops after reaching the limit)
const items = await square.catalog.list('ITEM', { limit: 50 });

// List all categories
const categories = await square.catalog.list('CATEGORY');

// List all discounts
const discounts = await square.catalog.list('DISCOUNT');
```

**Note:** The `list()` method handles pagination internally, fetching all pages until the cursor is exhausted or the specified limit is reached.

## Batch Retrieval

Get multiple objects in one call:

```typescript
const items = await square.catalog.batchGet([
  'ITEM_123',
  'ITEM_456',
  'ITEM_789',
]);

for (const item of items) {
  console.log(item.id, item.itemData?.name);
}
```

## Upserting Catalog Objects

The `upsert()` method allows you to create or update any catalog object directly:

```typescript
// Update an existing item's custom attributes
const existingItem = await square.catalog.get('ITEM_123');
const updatedItem = await square.catalog.upsert({
  type: 'ITEM',
  id: existingItem.id,
  version: existingItem.version,
  customAttributeValues: {
    'Square:some-key': { stringValue: 'new value' },
  },
  itemData: existingItem.itemData,
});

// Update a variation's price
const variation = existingItem.itemData?.variations?.[0];
if (variation) {
  const updatedVariation = await square.catalog.upsert({
    type: 'ITEM_VARIATION',
    id: variation.id,
    version: variation.version,
    itemVariationData: {
      ...variation.itemVariationData,
      priceMoney: { amount: BigInt(500), currency: 'USD' },
    },
  });
}
```

### Custom Attribute Definitions

You can create and manage custom attribute definitions:

```typescript
// Create a custom attribute definition
const attrDef = await square.catalog.upsert({
  type: 'CUSTOM_ATTRIBUTE_DEFINITION',
  id: '#attr_def_1',
  customAttributeDefinitionData: {
    type: 'STRING',
    name: 'Product Code',
    description: 'Internal product code',
    allowedObjectTypes: ['ITEM', 'ITEM_VARIATION'],
    sellerVisibility: 'SELLER_VISIBILITY_READ_WRITE_VALUES',
    appVisibility: 'APP_VISIBILITY_READ_WRITE_VALUES',
  },
});
```

## Deleting Catalog Objects

```typescript
await square.catalog.delete('ITEM_123');
```

## Using Catalog Items in Orders

Reference catalog items when creating orders:

```typescript
// Get the variation ID from your item
const item = await square.catalog.get('ITEM_123');
const variationId = item.itemData?.variations?.[0]?.id;

// Create order with catalog item
const order = await square.orders
  .builder()
  .addItem({ catalogObjectId: variationId!, quantity: 2 })
  .build();
```

## Working with Item Data

### Extract Pricing

```typescript
function getItemPrice(item: CatalogObject): number | null {
  const variation = item.itemData?.variations?.[0];
  const amount = variation?.itemVariationData?.priceMoney?.amount;
  return amount ? Number(amount) : null;
}

const item = await square.catalog.get('ITEM_123');
const priceInCents = getItemPrice(item);
console.log('Price: $' + (priceInCents! / 100).toFixed(2));
```

### Find Variation by Name

```typescript
function findVariation(item: CatalogObject, name: string) {
  return item.itemData?.variations?.find(
    (v) => v.itemVariationData?.name === name
  );
}

const item = await square.catalog.get('ITEM_123');
const largeVariation = findVariation(item, 'Large');
console.log('Large ID:', largeVariation?.id);
```

### Build Product List

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    sku?: string;
  }>;
}

async function getProducts(): Promise<Product[]> {
  const items = await square.catalog.list('ITEM');

  return items.map((item) => ({
    id: item.id,
    name: item.itemData?.name ?? '',
    description: item.itemData?.description,
    variants:
      item.itemData?.variations?.map((v) => ({
        id: v.id,
        name: v.itemVariationData?.name ?? '',
        price: Number(v.itemVariationData?.priceMoney?.amount ?? 0),
        sku: v.itemVariationData?.sku,
      })) ?? [],
  }));
}

const products = await getProducts();
console.log(JSON.stringify(products, null, 2));
```

## Error Handling

```typescript
import {
  SquareValidationError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  const item = await square.catalog.createItem({
    name: '',  // Invalid - empty name
    variations: [],  // Invalid - no variations
  });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  } else if (error instanceof SquareApiError) {
    console.error('API error:', error.errors);
  }
}
```

## Advanced: Using Raw SDK

For advanced catalog operations, use the raw SDK:

```typescript
// Create a discount
const discount = await square.sdk.catalog.object.upsert({
  idempotencyKey: crypto.randomUUID(),
  object: {
    type: 'DISCOUNT',
    id: '#discount_1',
    discountData: {
      name: '10% Off',
      discountType: 'FIXED_PERCENTAGE',
      percentage: '10.0',
    },
  },
});

// Create a tax
const tax = await square.sdk.catalog.object.upsert({
  idempotencyKey: crypto.randomUUID(),
  object: {
    type: 'TAX',
    id: '#tax_1',
    taxData: {
      name: 'Sales Tax',
      percentage: '8.5',
      inclusionType: 'ADDITIVE',
    },
  },
});
```

## Best Practices

1. **Use variations** - Every item needs at least one variation for pricing
2. **Organize with categories** - Makes catalog easier to navigate
3. **Set SKUs** - Helps with inventory and external system integration
4. **Batch operations** - Use `batchGet` for fetching multiple items
5. **Cache catalog data** - Catalog doesn't change frequently

## Next Steps

- [Orders Guide](./orders.md) - Use catalog items in orders
- [React Hooks](../react/hooks.md) - Display catalog in React
- [Angular Services](../angular/services.md) - Catalog in Angular
