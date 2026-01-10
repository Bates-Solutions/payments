[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / UseCatalogReturn

# Interface: UseCatalogReturn

Defined in: [src/react/hooks/useCatalog.ts:69](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCatalog.ts#L69)

Return type for useCatalog hook

## Extends

- [`QueryState`](QueryState.md)\<[`CatalogItemResponse`](CatalogItemResponse.md)[]\>

## Properties

### data

> **data**: [`CatalogItemResponse`](CatalogItemResponse.md)[] \| `null`

Defined in: [src/react/types.ts:217](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L217)

#### Inherited from

[`QueryState`](QueryState.md).[`data`](QueryState.md#data)

***

### error

> **error**: `Error` \| `null`

Defined in: [src/react/types.ts:218](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L218)

#### Inherited from

[`QueryState`](QueryState.md).[`error`](QueryState.md#error)

***

### get()

> **get**: (`objectId`) => `Promise`\<[`CatalogItemResponse`](CatalogItemResponse.md)\>

Defined in: [src/react/hooks/useCatalog.ts:73](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCatalog.ts#L73)

Get a catalog item by ID

#### Parameters

##### objectId

`string`

#### Returns

`Promise`\<[`CatalogItemResponse`](CatalogItemResponse.md)\>

***

### list()

> **list**: (`type`, `limit?`) => `Promise`\<[`CatalogItemResponse`](CatalogItemResponse.md)[]\>

Defined in: [src/react/hooks/useCatalog.ts:75](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCatalog.ts#L75)

List items by type

#### Parameters

##### type

[`CatalogObjectType`](../type-aliases/CatalogObjectType.md)

##### limit?

`number`

#### Returns

`Promise`\<[`CatalogItemResponse`](CatalogItemResponse.md)[]\>

***

### loading

> **loading**: `boolean`

Defined in: [src/react/types.ts:219](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L219)

#### Inherited from

[`QueryState`](QueryState.md).[`loading`](QueryState.md#loading)

***

### refetch()

> **refetch**: () => `Promise`\<`void`\>

Defined in: [src/react/types.ts:220](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L220)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`QueryState`](QueryState.md).[`refetch`](QueryState.md#refetch)

***

### search()

> **search**: (`options?`) => `Promise`\<[`CatalogItemResponse`](CatalogItemResponse.md)[]\>

Defined in: [src/react/hooks/useCatalog.ts:71](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCatalog.ts#L71)

Search catalog items

#### Parameters

##### options?

[`CatalogSearchOptions`](CatalogSearchOptions.md)

#### Returns

`Promise`\<[`CatalogItemResponse`](CatalogItemResponse.md)[]\>
