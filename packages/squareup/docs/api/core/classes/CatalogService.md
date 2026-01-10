[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CatalogService

# Class: CatalogService

Defined in: [src/core/services/catalog.service.ts:122](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L122)

Catalog service for managing Square catalog items

## Example

```typescript
// Create an item with variations
const item = await square.catalog.createItem({
  name: 'Coffee',
  variations: [
    { name: 'Small', price: 350 },
    { name: 'Large', price: 450 },
  ],
});

// Search items
const results = await square.catalog.search({
  objectTypes: ['ITEM'],
  query: 'coffee',
});
```

## Constructors

### Constructor

> **new CatalogService**(`client`): `CatalogService`

Defined in: [src/core/services/catalog.service.ts:123](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L123)

#### Parameters

##### client

`SquareClient`

#### Returns

`CatalogService`

## Methods

### batchGet()

> **batchGet**(`objectIds`): `Promise`\<`CatalogObject`[]\>

Defined in: [src/core/services/catalog.service.ts:372](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L372)

Batch retrieve multiple catalog objects

#### Parameters

##### objectIds

`string`[]

Array of object IDs to retrieve

#### Returns

`Promise`\<`CatalogObject`[]\>

Array of catalog objects

#### Example

```typescript
const items = await square.catalog.batchGet(['ITEM_1', 'ITEM_2', 'ITEM_3']);
```

***

### createCategory()

> **createCategory**(`options`): `Promise`\<`CatalogObject`\>

Defined in: [src/core/services/catalog.service.ts:205](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L205)

Create a category

#### Parameters

##### options

`CreateCategoryOptions`

Category creation options

#### Returns

`Promise`\<`CatalogObject`\>

Created category

#### Example

```typescript
const category = await square.catalog.createCategory({
  name: 'Beverages',
});
```

***

### createItem()

> **createItem**(`options`): `Promise`\<`CatalogObject`\>

Defined in: [src/core/services/catalog.service.ts:144](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L144)

Create a catalog item with variations

#### Parameters

##### options

`CreateCatalogItemOptions`

Item creation options

#### Returns

`Promise`\<`CatalogObject`\>

Created catalog object

#### Example

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
```

***

### delete()

> **delete**(`objectId`): `Promise`\<`void`\>

Defined in: [src/core/services/catalog.service.ts:270](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L270)

Delete a catalog object

#### Parameters

##### objectId

`string`

Catalog object ID to delete

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await square.catalog.delete('ITEM_123');
```

***

### get()

> **get**(`objectId`): `Promise`\<`CatalogObject`\>

Defined in: [src/core/services/catalog.service.ts:243](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L243)

Get a catalog object by ID

#### Parameters

##### objectId

`string`

Catalog object ID

#### Returns

`Promise`\<`CatalogObject`\>

Catalog object

#### Example

```typescript
const item = await square.catalog.get('ITEM_123');
```

***

### list()

> **list**(`objectType`, `options?`): `Promise`\<`CatalogObject`[]\>

Defined in: [src/core/services/catalog.service.ts:336](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L336)

List all catalog objects of a specific type

#### Parameters

##### objectType

`CatalogObjectType`

Type of objects to list

##### options?

List options

###### limit?

`number`

#### Returns

`Promise`\<`CatalogObject`[]\>

Array of catalog objects

#### Example

```typescript
const items = await square.catalog.list('ITEM', { limit: 50 });
```

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: `CatalogObject`[]; \}\>

Defined in: [src/core/services/catalog.service.ts:298](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/catalog.service.ts#L298)

Search the catalog

#### Parameters

##### options?

`SearchCatalogOptions`

Search options

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: `CatalogObject`[]; \}\>

Matching catalog objects with pagination

#### Example

```typescript
// Search for items
const results = await square.catalog.search({
  objectTypes: ['ITEM'],
  query: 'coffee',
});

// Get all categories
const categories = await square.catalog.search({
  objectTypes: ['CATEGORY'],
});
```
