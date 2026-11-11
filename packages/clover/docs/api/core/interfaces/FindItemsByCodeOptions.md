[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / FindItemsByCodeOptions

# Interface: FindItemsByCodeOptions

Defined in: [core/services/inventory.service.ts:150](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L150)

Codes to look up with `inventory.findItemsByCode()`. Give either list, or
both.

## Properties

### codes?

> `optional` **codes?**: `string`[]

Defined in: [core/services/inventory.service.ts:152](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L152)

Product codes (UPC / EAN barcodes), matched against the item `code`

***

### expand?

> `optional` **expand?**: [`ItemExpand`](../type-aliases/ItemExpand.md)[]

Defined in: [core/services/inventory.service.ts:156](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L156)

Related data to embed in each item, e.g. `['itemStock']`

***

### skus?

> `optional` **skus?**: `string`[]

Defined in: [core/services/inventory.service.ts:154](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L154)

SKUs, matched against the item `sku`
