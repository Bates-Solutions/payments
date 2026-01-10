[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / SquareCatalogService

# Class: SquareCatalogService

Defined in: [src/angular/services/square-catalog.service.ts:26](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-catalog.service.ts#L26)

Service for Square catalog operations

## Example

```typescript
@Component({...})
export class ProductsComponent implements OnInit {
  products$ = this.catalog.list();

  constructor(private catalog: SquareCatalogService) {}

  search(query: string) {
    return this.catalog.search({ textFilter: query });
  }
}
```

## Constructors

### Constructor

> **new SquareCatalogService**(): `SquareCatalogService`

#### Returns

`SquareCatalogService`

## Properties

### error$

> `readonly` **error$**: `Observable`\<`Error` \| `null`\>

Defined in: [src/angular/services/square-catalog.service.ts:34](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-catalog.service.ts#L34)

Observable of errors

***

### loading$

> `readonly` **loading$**: `Observable`\<`boolean`\>

Defined in: [src/angular/services/square-catalog.service.ts:31](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-catalog.service.ts#L31)

Observable of loading state

## Methods

### batchRetrieve()

> **batchRetrieve**\<`T`\>(`objectIds`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-catalog.service.ts:160](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-catalog.service.ts#L160)

Batch retrieve catalog items by IDs

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### objectIds

`string`[]

The catalog object IDs

##### apiEndpoint

`string` = `'/api/catalog'`

Backend API endpoint (default: '/api/catalog')

#### Returns

`Observable`\<`T`\>

Observable of the catalog items

***

### list()

> **list**\<`T`\>(`types?`, `apiEndpoint?`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-catalog.service.ts:43](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-catalog.service.ts#L43)

List catalog items

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### types?

`string`[]

Optional types to filter by

##### apiEndpoint?

`string` = `'/api/catalog'`

Backend API endpoint (default: '/api/catalog')

#### Returns

`Observable`\<`T`\>

Observable of catalog items

***

### retrieve()

> **retrieve**\<`T`\>(`objectId`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-catalog.service.ts:124](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-catalog.service.ts#L124)

Retrieve a catalog item by ID

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### objectId

`string`

The catalog object ID

##### apiEndpoint

`string` = `'/api/catalog'`

Backend API endpoint (default: '/api/catalog')

#### Returns

`Observable`\<`T`\>

Observable of the catalog item

***

### search()

> **search**\<`T`\>(`request`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-catalog.service.ts:84](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-catalog.service.ts#L84)

Search catalog items

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### request

[`CatalogSearchRequest`](../interfaces/CatalogSearchRequest.md)

Search request

##### apiEndpoint

`string` = `'/api/catalog'`

Backend API endpoint (default: '/api/catalog')

#### Returns

`Observable`\<`T`\>

Observable of matching catalog items
