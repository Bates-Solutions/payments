[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / ItemStock

# Interface: ItemStock

Defined in: [core/services/inventory.service.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L32)

Stock level of an item (`/v3/merchants/{mId}/item_stocks/{itemId}`).

## Properties

### item?

> `optional` **item?**: `object`

Defined in: [core/services/inventory.service.ts:34](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L34)

The item this stock belongs to

#### id

> **id**: `string`

***

### modifiedTime?

> `optional` **modifiedTime?**: `number`

Defined in: [core/services/inventory.service.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L42)

Last modified, in milliseconds since the epoch

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/services/inventory.service.ts:36](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L36)

Current count in stock. Can be fractional for `PER_UNIT` items.

***

### stockAlertThreshold?

> `optional` **stockAlertThreshold?**: `number`

Defined in: [core/services/inventory.service.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L40)

Low stock alert threshold (only when the merchant uses low stock alerts)

***

### ~~stockCount?~~

> `optional` **stockCount?**: `number`

Defined in: [core/services/inventory.service.ts:38](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L38)

#### Deprecated

Clover deprecated this in favour of `quantity`.
