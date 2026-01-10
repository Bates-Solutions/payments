[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / InventoryService

# Class: InventoryService

Defined in: [src/core/services/inventory.service.ts:83](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L83)

Inventory service for managing Square inventory

## Example

```typescript
// Get inventory count for an item
const counts = await square.inventory.getCounts('ITEM_VAR_123');

// Adjust inventory
await square.inventory.adjust({
  catalogObjectId: 'ITEM_VAR_123',
  locationId: 'LXXX',
  quantity: 10,
});
```

## Constructors

### Constructor

> **new InventoryService**(`client`, `defaultLocationId?`): `InventoryService`

Defined in: [src/core/services/inventory.service.ts:84](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L84)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

#### Returns

`InventoryService`

## Methods

### adjust()

> **adjust**(`options`): `Promise`\<`InventoryCount`[]\>

Defined in: [src/core/services/inventory.service.ts:236](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L236)

Adjust inventory (add or remove stock)

#### Parameters

##### options

Adjustment options

###### catalogObjectId

`string`

###### idempotencyKey?

`string`

###### locationId?

`string`

###### quantity

`number`

###### reason?

`string`

#### Returns

`Promise`\<`InventoryCount`[]\>

Updated inventory counts

#### Example

```typescript
// Add 10 items to stock
await square.inventory.adjust({
  catalogObjectId: 'ITEM_VAR_123',
  locationId: 'LXXX',
  quantity: 10,
});

// Remove 5 items (negative quantity)
await square.inventory.adjust({
  catalogObjectId: 'ITEM_VAR_123',
  locationId: 'LXXX',
  quantity: -5,
});
```

***

### batchChange()

> **batchChange**(`changes`, `idempotencyKey?`): `Promise`\<`InventoryCount`[]\>

Defined in: [src/core/services/inventory.service.ts:352](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L352)

Batch apply multiple inventory changes

#### Parameters

##### changes

`InventoryChange`[]

Array of inventory changes

##### idempotencyKey?

`string`

Optional idempotency key

#### Returns

`Promise`\<`InventoryCount`[]\>

Updated inventory counts

#### Example

```typescript
await square.inventory.batchChange([
  {
    type: 'ADJUSTMENT',
    adjustment: {
      catalogObjectId: 'ITEM_1',
      fromState: 'NONE',
      toState: 'IN_STOCK',
      locationId: 'LXXX',
      quantity: '10',
    },
  },
]);
```

***

### batchGetCounts()

> **batchGetCounts**(`catalogObjectIds`, `locationIds?`): `Promise`\<`InventoryCount`[]\>

Defined in: [src/core/services/inventory.service.ts:135](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L135)

Batch retrieve inventory counts for multiple objects

#### Parameters

##### catalogObjectIds

`string`[]

Array of catalog object IDs

##### locationIds?

`string`[]

Optional array of location IDs

#### Returns

`Promise`\<`InventoryCount`[]\>

Array of inventory counts

#### Example

```typescript
const counts = await square.inventory.batchGetCounts(
  ['ITEM_VAR_1', 'ITEM_VAR_2'],
  ['LOCATION_1']
);
```

***

### getCounts()

> **getCounts**(`catalogObjectId`, `locationId?`): `Promise`\<`InventoryCount`[]\>

Defined in: [src/core/services/inventory.service.ts:102](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L102)

Get inventory counts for a catalog object

#### Parameters

##### catalogObjectId

`string`

Catalog object ID (usually item variation)

##### locationId?

`string`

Optional location ID filter

#### Returns

`Promise`\<`InventoryCount`[]\>

Array of inventory counts

#### Example

```typescript
const counts = await square.inventory.getCounts('ITEM_VAR_123');
console.log(`In stock: ${counts[0].quantity}`);
```

***

### setCount()

> **setCount**(`options`): `Promise`\<`InventoryCount`[]\>

Defined in: [src/core/services/inventory.service.ts:175](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L175)

Set the inventory count for an item (physical count)

#### Parameters

##### options

Physical count options

###### catalogObjectId

`string`

###### idempotencyKey?

`string`

###### locationId?

`string`

###### occurredAt?

`string`

###### quantity

`number`

#### Returns

`Promise`\<`InventoryCount`[]\>

Updated inventory counts

#### Example

```typescript
await square.inventory.setCount({
  catalogObjectId: 'ITEM_VAR_123',
  locationId: 'LXXX',
  quantity: 50,
});
```

***

### transfer()

> **transfer**(`options`): `Promise`\<`InventoryCount`[]\>

Defined in: [src/core/services/inventory.service.ts:294](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/inventory.service.ts#L294)

Transfer inventory between locations

#### Parameters

##### options

Transfer options

###### catalogObjectId

`string`

###### fromLocationId

`string`

###### idempotencyKey?

`string`

###### quantity

`number`

###### toLocationId

`string`

#### Returns

`Promise`\<`InventoryCount`[]\>

Updated inventory counts

#### Example

```typescript
await square.inventory.transfer({
  catalogObjectId: 'ITEM_VAR_123',
  fromLocationId: 'LOCATION_A',
  toLocationId: 'LOCATION_B',
  quantity: 5,
});
```
