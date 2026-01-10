# Managing Orders

This guide covers how to create and manage orders using the Square API with `@bates-solutions/squareup`.

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
  locationId: 'YOUR_LOCATION_ID',
});
```

## Creating Orders with the Builder

The recommended way to create orders is using the fluent builder API:

```typescript
const order = await square.orders
  .builder()
  .addItem({ name: 'Latte', amount: 450 })
  .addItem({ name: 'Croissant', amount: 350 })
  .build();

console.log('Order ID:', order.id);
console.log('Total:', order.totalMoney?.amount);
```

### Builder Methods

```typescript
const order = await square.orders
  .builder()
  // Add items (required)
  .addItem({ name: 'Coffee', amount: 350 })
  .addItem({ catalogObjectId: 'ITEM_123', quantity: 2 })

  // Optional settings
  .withCurrency('USD')           // Set currency (default: USD)
  .withTip(100)                  // Add tip ($1.00)
  .withCustomer('CUST_123')      // Associate customer
  .withReference('ext-order-1')  // External reference ID
  .build();
```

### Ad-hoc Line Items

For items without a catalog entry:

```typescript
const order = await square.orders
  .builder()
  .addItem({
    name: 'Custom Service',
    amount: 2500,      // $25.00 in cents
    quantity: 1,       // Default: 1
    note: 'Special request',
  })
  .build();
```

### Catalog Line Items

For items from your Square catalog:

```typescript
const order = await square.orders
  .builder()
  .addItem({
    catalogObjectId: 'ITEM_VARIATION_123',
    quantity: 3,
  })
  .build();
```

### Adding Multiple Items

```typescript
const items = [
  { name: 'Latte', amount: 450 },
  { name: 'Muffin', amount: 350 },
  { catalogObjectId: 'ITEM_123' },
];

const order = await square.orders
  .builder()
  .addItems(items)
  .build();
```

### Previewing Before Creating

Check the order configuration before submitting:

```typescript
const builder = square.orders
  .builder()
  .addItem({ name: 'Test Item', amount: 100 })
  .withCustomer('CUST_123');

const preview = builder.preview();
console.log('Will create:', preview);
// {
//   locationId: 'LXXX',
//   lineItems: [...],
//   customerId: 'CUST_123',
//   currency: 'USD'
// }

// If satisfied, create the order
const order = await builder.build();
```

## Creating Orders Directly

For simpler cases, create orders without the builder:

```typescript
const order = await square.orders.create({
  lineItems: [
    { name: 'Coffee', amount: 350 },
    { catalogObjectId: 'ITEM_123', quantity: 2 },
  ],
  customerId: 'CUST_123',
  referenceId: 'my-order-ref',
});
```

## Getting Order Details

```typescript
const order = await square.orders.get('ORDER_123');

console.log('State:', order.state);
console.log('Total:', order.totalMoney?.amount);
console.log('Items:', order.lineItems?.length);
console.log('Customer:', order.customerId);
```

## Searching Orders

```typescript
// Search with default location
const { data: orders, cursor } = await square.orders.search({
  limit: 20,
});

// Search specific locations
const { data: multiLocationOrders } = await square.orders.search({
  locationIds: ['LOC_1', 'LOC_2'],
  limit: 50,
});

// Paginate through results
let nextCursor: string | undefined;
do {
  const { data, cursor } = await square.orders.search({
    cursor: nextCursor,
    limit: 100,
  });

  for (const order of data) {
    console.log(order.id, order.state);
  }

  nextCursor = cursor;
} while (nextCursor);
```

## Updating Orders

```typescript
// Get current order first (need version for updates)
const order = await square.orders.get('ORDER_123');

// Update the order
const updated = await square.orders.update('ORDER_123', {
  version: order.version!, // Required for concurrency control
  referenceId: 'new-reference',
});
```

## Paying for Orders

Apply payments to complete an order:

```typescript
// First, create a payment
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 800, // Must match order total
  orderId: 'ORDER_123',
});

// Then, mark the order as paid
const paidOrder = await square.orders.pay('ORDER_123', [payment.id!]);
console.log('Order state:', paidOrder.state); // 'COMPLETED'
```

### Pay with Multiple Payments

```typescript
// Split payment example
const payment1 = await square.payments.create({
  sourceId: 'cnon:card-nonce-1',
  amount: 500,
  orderId: 'ORDER_123',
});

const payment2 = await square.payments.create({
  sourceId: 'cnon:card-nonce-2',
  amount: 300,
  orderId: 'ORDER_123',
});

const paidOrder = await square.orders.pay('ORDER_123', [
  payment1.id!,
  payment2.id!,
]);
```

## Order States

| State | Description |
|-------|-------------|
| `OPEN` | Order created, awaiting payment |
| `COMPLETED` | Order paid and fulfilled |
| `CANCELED` | Order was canceled |

## Complete Checkout Flow

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

async function checkout(
  items: Array<{ name: string; amount: number }>,
  paymentToken: string,
  customerId?: string
) {
  const square = createSquareClient({
    accessToken: process.env.SQUARE_ACCESS_TOKEN!,
    environment: 'sandbox',
    locationId: process.env.SQUARE_LOCATION_ID!,
  });

  // 1. Create the order
  const builder = square.orders.builder();

  for (const item of items) {
    builder.addItem(item);
  }

  if (customerId) {
    builder.withCustomer(customerId);
  }

  const order = await builder.build();

  // 2. Create payment for the order
  const payment = await square.payments.create({
    sourceId: paymentToken,
    amount: Number(order.totalMoney?.amount ?? 0),
    orderId: order.id,
    customerId,
  });

  // 3. Mark order as paid
  const paidOrder = await square.orders.pay(order.id!, [payment.id!]);

  return {
    orderId: paidOrder.id,
    paymentId: payment.id,
    total: paidOrder.totalMoney?.amount,
  };
}

// Usage
const result = await checkout(
  [
    { name: 'Latte', amount: 450 },
    { name: 'Muffin', amount: 350 },
  ],
  'cnon:card-nonce-ok',
  'CUST_123'
);
```

## Error Handling

```typescript
import {
  SquareValidationError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  const order = await square.orders
    .builder()
    .addItem({ name: 'Item', amount: 100 })
    .build();
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  } else if (error instanceof SquareApiError) {
    console.error('API error:', error.statusCode);
    console.error('Details:', error.errors);
  }
}
```

## Best Practices

1. **Use the builder** - It provides validation and a cleaner API
2. **Associate customers** - Links orders to customer profiles for tracking
3. **Use reference IDs** - Map to your internal order system
4. **Handle versions** - Use `version` field for safe concurrent updates
5. **Complete atomically** - Create payment and mark paid in one flow

## Next Steps

- [Payments Guide](./payments.md) - Process payments for orders
- [Customers Guide](./customers.md) - Associate customers with orders
- [Catalog Guide](./catalog.md) - Use catalog items in orders
