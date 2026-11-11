[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / Item

# Interface: Item

Defined in: [core/services/inventory.service.ts:48](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L48)

A Clover inventory item (`/v3/merchants/{mId}/items`).

## Properties

### alternateName?

> `optional` **alternateName?**: `string`

Defined in: [core/services/inventory.service.ts:51](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L51)

***

### autoManage?

> `optional` **autoManage?**: `boolean`

Defined in: [core/services/inventory.service.ts:68](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L68)

Availability managed automatically from stock

***

### available?

> `optional` **available?**: `boolean`

Defined in: [core/services/inventory.service.ts:66](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L66)

Sellable on all channels

***

### categories?

> `optional` **categories?**: `object`[]

Defined in: [core/services/inventory.service.ts:76](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L76)

#### id

> **id**: `string`

#### name?

> `optional` **name?**: `string`

***

### code?

> `optional` **code?**: `string`

Defined in: [core/services/inventory.service.ts:53](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L53)

Product code such as a UPC or EAN barcode. Searchable with `findItemsByCode()`.

***

### cost?

> `optional` **cost?**: `number`

Defined in: [core/services/inventory.service.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L60)

The merchant's cost in cents

***

### defaultTaxRates?

> `optional` **defaultTaxRates?**: `boolean`

Defined in: [core/services/inventory.service.ts:70](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L70)

***

### deletedTime?

> `optional` **deletedTime?**: `number`

Defined in: [core/services/inventory.service.ts:79](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L79)

***

### hidden?

> `optional` **hidden?**: `boolean`

Defined in: [core/services/inventory.service.ts:64](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L64)

Hidden in the Register app

***

### id?

> `optional` **id?**: `string`

Defined in: [core/services/inventory.service.ts:49](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L49)

***

### isRevenue?

> `optional` **isRevenue?**: `boolean`

Defined in: [core/services/inventory.service.ts:69](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L69)

***

### itemStock?

> `optional` **itemStock?**: [`ItemStock`](ItemStock.md)

Defined in: [core/services/inventory.service.ts:72](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L72)

Present when requested with `expand: ['itemStock']`

***

### modifiedTime?

> `optional` **modifiedTime?**: `number`

Defined in: [core/services/inventory.service.ts:78](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L78)

Last modified, in milliseconds since the epoch

***

### name?

> `optional` **name?**: `string`

Defined in: [core/services/inventory.service.ts:50](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L50)

***

### price?

> `optional` **price?**: `number`

Defined in: [core/services/inventory.service.ts:57](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L57)

Price in cents

***

### priceType?

> `optional` **priceType?**: [`ItemPriceType`](../type-aliases/ItemPriceType.md)

Defined in: [core/services/inventory.service.ts:58](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L58)

***

### sku?

> `optional` **sku?**: `string`

Defined in: [core/services/inventory.service.ts:55](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L55)

Stock keeping unit. Searchable with `findItemsByCode()`.

***

### ~~stockCount?~~

> `optional` **stockCount?**: `number`

Defined in: [core/services/inventory.service.ts:74](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L74)

#### Deprecated

Clover deprecated this in favour of `itemStock.quantity`.

***

### tags?

> `optional` **tags?**: `object`[]

Defined in: [core/services/inventory.service.ts:75](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L75)

#### id

> **id**: `string`

#### name?

> `optional` **name?**: `string`

***

### unitName?

> `optional` **unitName?**: `string`

Defined in: [core/services/inventory.service.ts:62](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L62)

Unit of measure for `PER_UNIT` items, e.g. `lb`
