[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / InventoryService

# Class: InventoryService

Defined in: [core/services/inventory.service.ts:236](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L236)

Inventory service wrapping Clover's Platform
[inventory](https://docs.clover.com/dev/reference/inventorygetitems) API:
items (`/v3/merchants/{mId}/items`) and their stock
(`/v3/merchants/{mId}/item_stocks`).

Requires a `merchantId` on the client.

## Example

```typescript
const [item] = await clover.inventory.findItemsByCode({
  codes: ['012345678905'],
  expand: ['itemStock'],
});
console.log(item?.name, item?.itemStock?.quantity);
```

## Constructors

### Constructor

> **new InventoryService**(`http`): `InventoryService`

Defined in: [core/services/inventory.service.ts:237](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L237)

#### Parameters

##### http

[`CloverHttp`](CloverHttp.md)

#### Returns

`InventoryService`

## Methods

### createItem()

> **createItem**(`options`): `Promise`\<[`Item`](../interfaces/Item.md)\>

Defined in: [core/services/inventory.service.ts:378](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L378)

Create an item.

#### Parameters

##### options

[`CreateItemOptions`](../interfaces/CreateItemOptions.md)

#### Returns

`Promise`\<[`Item`](../interfaces/Item.md)\>

#### Throws

When `name` is empty or `price` / `cost`
  is not a non-negative integer number of cents

***

### findItemsByCode()

> **findItemsByCode**(`options`): `Promise`\<[`Item`](../interfaces/Item.md)[]\>

Defined in: [core/services/inventory.service.ts:328](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L328)

Find items by product code (UPC / EAN barcode) or SKU, without listing
the whole inventory. Pages through every match and returns each item
once, even if it matches several codes.

Codes are passed to Clover as exact-match filters and are not normalized:
a UPC-A `012345678905` won't find the same barcode stored as EAN-13
`0012345678905`. Pass both forms if the inventory may hold either.

Makes one request per code (more for codes with over 1000 matches).

#### Parameters

##### options

[`FindItemsByCodeOptions`](../interfaces/FindItemsByCodeOptions.md)

#### Returns

`Promise`\<[`Item`](../interfaces/Item.md)[]\>

#### Example

```typescript
const items = await clover.inventory.findItemsByCode({
  codes: ['012345678905'],
  skus: ['PICKLE-DILL-500'],
  expand: ['itemStock'],
});
```

***

### getItem()

> **getItem**(`itemId`, `options?`): `Promise`\<[`Item`](../interfaces/Item.md)\>

Defined in: [core/services/inventory.service.ts:298](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L298)

Retrieve an item by ID.

#### Parameters

##### itemId

`string`

##### options?

[`GetItemOptions`](../interfaces/GetItemOptions.md)

#### Returns

`Promise`\<[`Item`](../interfaces/Item.md)\>

***

### getItemStock()

> **getItemStock**(`itemId`): `Promise`\<[`ItemStock`](../interfaces/ItemStock.md)\>

Defined in: [core/services/inventory.service.ts:436](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L436)

Get an item's stock level.

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<[`ItemStock`](../interfaces/ItemStock.md)\>

#### Example

```typescript
const { quantity } = await clover.inventory.getItemStock('ITEM_1');
```

***

### listItems()

> **listItems**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Item`](../interfaces/Item.md)\>\>

Defined in: [core/services/inventory.service.ts:274](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L274)

List items with offset-based pagination (Clover allows up to 1000 per
page). Use `filter` to narrow the list and `expand: ['itemStock']` to get
stock levels in the same call.

#### Parameters

##### options?

[`ListItemsOptions`](../interfaces/ListItemsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Item`](../interfaces/Item.md)\>\>

#### Example

```typescript
const { data } = await clover.inventory.listItems({
  filter: ['hidden=false'],
  expand: ['itemStock'],
  limit: 100,
});
```

***

### updateItem()

> **updateItem**(`itemId`, `options`): `Promise`\<[`Item`](../interfaces/Item.md)\>

Defined in: [core/services/inventory.service.ts:407](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L407)

Update an item. Only the fields you pass are sent. Stock is not changed
here; use [InventoryService.updateItemStock](#updateitemstock).

#### Parameters

##### itemId

`string`

##### options

[`UpdateItemOptions`](../interfaces/UpdateItemOptions.md)

#### Returns

`Promise`\<[`Item`](../interfaces/Item.md)\>

#### Throws

When no field is given, or `price` /
  `cost` is not a non-negative integer number of cents

***

### updateItemStock()

> **updateItemStock**(`itemId`, `options`): `Promise`\<[`ItemStock`](../interfaces/ItemStock.md)\>

Defined in: [core/services/inventory.service.ts:459](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L459)

Set an item's stock level. `quantity` replaces the current count; to add
a delivery, read the stock first and send the new total.

Resolves to the stock Clover returns, or to the stock you sent when
Clover's response has no body.

#### Parameters

##### itemId

`string`

##### options

[`UpdateItemStockOptions`](../interfaces/UpdateItemStockOptions.md)

#### Returns

`Promise`\<[`ItemStock`](../interfaces/ItemStock.md)\>

#### Throws

When `quantity` is not a finite number

#### Example

```typescript
const { quantity = 0 } = await clover.inventory.getItemStock('ITEM_1');
await clover.inventory.updateItemStock('ITEM_1', { quantity: quantity + 24 });
```
