[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CreateItemOptions

# Interface: CreateItemOptions

Defined in: [core/services/inventory.service.ts:128](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L128)

Options for `inventory.createItem()`. `name` and `price` are required.

## Extends

- [`ItemFields`](ItemFields.md)

## Properties

### alternateName?

> `optional` **alternateName?**: `string`

Defined in: [core/services/inventory.service.ts:110](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L110)

#### Inherited from

[`ItemFields`](ItemFields.md).[`alternateName`](ItemFields.md#alternatename)

***

### available?

> `optional` **available?**: `boolean`

Defined in: [core/services/inventory.service.ts:121](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L121)

#### Inherited from

[`ItemFields`](ItemFields.md).[`available`](ItemFields.md#available)

***

### code?

> `optional` **code?**: `string`

Defined in: [core/services/inventory.service.ts:112](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L112)

Product code such as a UPC or EAN barcode

#### Inherited from

[`ItemFields`](ItemFields.md).[`code`](ItemFields.md#code)

***

### cost?

> `optional` **cost?**: `number`

Defined in: [core/services/inventory.service.ts:118](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L118)

The merchant's cost in cents (integer)

#### Inherited from

[`ItemFields`](ItemFields.md).[`cost`](ItemFields.md#cost)

***

### hidden?

> `optional` **hidden?**: `boolean`

Defined in: [core/services/inventory.service.ts:120](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L120)

#### Inherited from

[`ItemFields`](ItemFields.md).[`hidden`](ItemFields.md#hidden)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/inventory.service.ts:133](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L133)

Idempotency key (defaults to a generated UUID)

***

### isRevenue?

> `optional` **isRevenue?**: `boolean`

Defined in: [core/services/inventory.service.ts:122](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L122)

#### Inherited from

[`ItemFields`](ItemFields.md).[`isRevenue`](ItemFields.md#isrevenue)

***

### name

> **name**: `string`

Defined in: [core/services/inventory.service.ts:129](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L129)

#### Overrides

[`ItemFields`](ItemFields.md).[`name`](ItemFields.md#name)

***

### price

> **price**: `number`

Defined in: [core/services/inventory.service.ts:131](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L131)

Price in cents (integer)

#### Overrides

[`ItemFields`](ItemFields.md).[`price`](ItemFields.md#price)

***

### priceType?

> `optional` **priceType?**: [`ItemPriceType`](../type-aliases/ItemPriceType.md)

Defined in: [core/services/inventory.service.ts:116](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L116)

#### Inherited from

[`ItemFields`](ItemFields.md).[`priceType`](ItemFields.md#pricetype)

***

### sku?

> `optional` **sku?**: `string`

Defined in: [core/services/inventory.service.ts:113](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L113)

#### Inherited from

[`ItemFields`](ItemFields.md).[`sku`](ItemFields.md#sku)

***

### unitName?

> `optional` **unitName?**: `string`

Defined in: [core/services/inventory.service.ts:119](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L119)

#### Inherited from

[`ItemFields`](ItemFields.md).[`unitName`](ItemFields.md#unitname)
