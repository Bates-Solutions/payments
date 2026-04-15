# Managing Customer Groups

This guide covers customer groups — the primary mechanism for gating Square pricing rules (wholesale tiers, member discounts) to specific customers.

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

## Creating a Group

```typescript
const group = await square.customerGroups.create({
  name: 'Wholesale',
});

console.log('Group ID:', group.id);
```

## Getting a Group

```typescript
const group = await square.customerGroups.get('GRP_123');

console.log('Name:', group.name);
console.log('Created:', group.createdAt);
```

## Updating a Group

The only updatable field is `name`.

```typescript
const updated = await square.customerGroups.update('GRP_123', {
  name: 'Wholesale Tier 1',
});
```

## Deleting a Group

Deletes the group and all memberships. Customers themselves are not deleted.

```typescript
await square.customerGroups.delete('GRP_123');
```

## Listing Groups

```typescript
const { groups, cursor } = await square.customerGroups.list({ limit: 50 });

for (const group of groups) {
  console.log(group.id, group.name);
}
```

### With Pagination

```typescript
let cursor: string | undefined;
const allGroups = [];

do {
  const { groups, cursor: nextCursor } = await square.customerGroups.list({
    limit: 100,
    cursor,
  });

  allGroups.push(...groups);
  cursor = nextCursor;
} while (cursor);
```

## Managing Membership

### Add a Customer to a Group

```typescript
await square.customerGroups.addCustomer('GRP_123', 'CUST_456');
```

### Remove a Customer from a Group

```typescript
await square.customerGroups.removeCustomer('GRP_123', 'CUST_456');
```

## Wholesale Pricing Workflow

Customer groups are most useful when paired with catalog pricing rules. The end-to-end flow:

```typescript
// 1. Create the group
const wholesale = await square.customerGroups.create({ name: 'Wholesale' });

// 2. Assign retailers to the group
await square.customerGroups.addCustomer(wholesale.id!, retailerCustomerId);

// 3. Create a wholesale pricing rule for selected items
await square.catalog.createWholesalePricing({
  name: 'Wholesale 20% off',
  customerGroupId: wholesale.id!,
  itemVariationIds: ['VAR_1', 'VAR_2'],
  discount: { percentage: '20' },
});
```

Once configured, members of the wholesale group will see the discounted price at Square POS, in invoices, and in any other Square-powered checkout — no app-side price overrides needed.

See the [Wholesale Pricing](./catalog.md#wholesale-pricing) section of the Catalog guide for the rule details.

## CustomerGroup Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique group ID |
| `name` | `string` | Group name |
| `createdAt` | `string` | Creation timestamp |
| `updatedAt` | `string` | Last update timestamp |

## Error Handling

```typescript
import {
  SquareValidationError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  await square.customerGroups.create({ name: '' });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof SquareApiError) {
    console.error('API error:', error.errors);
  }
}
```

## Best Practices

1. **One group per pricing tier** — `Wholesale Bronze`, `Wholesale Silver`, etc.
2. **Reuse groups across rules** — A single group can gate many pricing rules; you don't need a new group per rule.
3. **Check membership before adding** — Square allows duplicate `addCustomer` calls but it's wasteful.
4. **Avoid deleting groups in active use** — Pricing rules referencing a deleted group will silently lose their gating.

## Next Steps

- [Catalog Guide — Wholesale Pricing](./catalog.md#wholesale-pricing) — Create pricing rules gated by group
- [Customers Guide](./customers.md) — Manage the underlying customer records
