# Inventory

The `inventory` service reads and changes stock counts for catalog item variations.

> Requires `square@45` or later (Square API version `2026-07-15` or later). See [Upgrading from 1.x](#upgrading-from-1x).

Methods that write inventory take an optional `locationId`. When it is omitted they fall back to the client's `locationId`, and throw a `SquareValidationError` if neither is set.

## Read counts

```typescript
// One variation, all locations
const counts = await square.inventory.getCounts('ITEM_VAR_123');

// One variation, one location
const [count] = await square.inventory.getCounts('ITEM_VAR_123', 'LXXX');
console.log(count?.state, count?.quantity); // 'IN_STOCK', '12'

// Several variations at once
const many = await square.inventory.batchGetCounts(['ITEM_VAR_1', 'ITEM_VAR_2'], ['LXXX']);
```

Quantities are decimal strings, as Square returns them.

## Set a count (physical count)

Records an absolute `IN_STOCK` quantity, e.g. after a stocktake:

```typescript
await square.inventory.setCount({
  catalogObjectId: 'ITEM_VAR_123',
  locationId: 'LXXX',
  quantity: 50,
});
```

## Adjust stock

A positive `quantity` receives stock (`NONE` → `IN_STOCK`); a negative one sells it (`IN_STOCK` → `SOLD`):

```typescript
await square.inventory.adjust({ catalogObjectId: 'ITEM_VAR_123', quantity: 10 });
await square.inventory.adjust({ catalogObjectId: 'ITEM_VAR_123', quantity: -2 });
```

## Transfer between locations

```typescript
await square.inventory.transfer({
  catalogObjectId: 'ITEM_VAR_123',
  fromLocationId: 'LOCATION_A',
  toLocationId: 'LOCATION_B',
  quantity: 5,
});
```

Square no longer has a separate transfer type. This sends an `ADJUSTMENT` that keeps the stock `IN_STOCK` and moves it from `fromLocationId` to `toLocationId`.

## Batch changes

`batchChange()` applies several changes in one request. Each adjustment names the location before (`fromLocationId`) and after (`toLocationId`) the change. They are the same for a single-location adjustment and differ for a transfer:

```typescript
await square.inventory.batchChange([
  {
    type: 'ADJUSTMENT',
    adjustment: {
      catalogObjectId: 'ITEM_VAR_1',
      fromState: 'NONE',
      toState: 'IN_STOCK',
      fromLocationId: 'LXXX',
      toLocationId: 'LXXX',
      quantity: '10',
    },
  },
  {
    type: 'ADJUSTMENT',
    adjustment: {
      catalogObjectId: 'ITEM_VAR_2',
      fromState: 'IN_STOCK',
      toState: 'IN_STOCK',
      fromLocationId: 'LXXX',
      toLocationId: 'LYYY',
      quantity: '3',
    },
  },
  {
    type: 'PHYSICAL_COUNT',
    physicalCount: {
      catalogObjectId: 'ITEM_VAR_3',
      state: 'IN_STOCK',
      locationId: 'LXXX',
      quantity: '40',
    },
  },
]);
```

A change missing its payload (for example `type: 'ADJUSTMENT'` without `adjustment`), or an adjustment with no location, throws a `SquareValidationError` before anything is sent.

## Upgrading from 1.x

Version 2.0.0 requires `square@45` or later. Square API version `2026-07-15` retired the `TRANSFER` change type and `InventoryAdjustment.location_id`, and `square@45` no longer accepts them. Upgrade both packages together:

```bash
npx jsr add @bates-solutions/squareup@^2
npm install square@^46   # or square@^45
```

Code written against 1.x keeps working without changes:

| 1.x input                                              | Sent to Square as                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `adjust()` / `transfer()`                              | `ADJUSTMENT` with `fromLocationId` / `toLocationId`                       |
| `adjustment.locationId` in `batchChange()`             | fills whichever of `fromLocationId` / `toLocationId` is unset (deprecated) |
| `{ type: 'TRANSFER', transfer }` in `batchChange()`    | `ADJUSTMENT`, `fromState` = `toState` = `transfer.state` (deprecated)      |

Deprecated inputs are flagged by TypeScript and `@typescript-eslint/no-deprecated`. Move to `fromLocationId`/`toLocationId` at your own pace.

If you call the Square SDK directly through `square.sdk`, you have to migrate those calls yourself. See Square's [2026-07-15 changelog](https://developer.squareup.com/docs/changelog/connect-logs/2026-07-15).
