[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / ListItemsOptions

# Interface: ListItemsOptions

Defined in: [core/services/inventory.service.ts:85](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L85)

Options for `inventory.listItems()`.

## Extends

- [`PaginationOptions`](PaginationOptions.md)

## Properties

### expand?

> `optional` **expand?**: [`ItemExpand`](../type-aliases/ItemExpand.md)[]

Defined in: [core/services/inventory.service.ts:94](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L94)

Related data to embed, e.g. `['itemStock']`

***

### filter?

> `optional` **filter?**: `string`[]

Defined in: [core/services/inventory.service.ts:92](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L92)

Raw Clover filters, each `field<op>value`, e.g. `['sku=PICKLE-1',
'hidden=false']`. Several filters are combined with AND.

#### See

https://docs.clover.com/docs/applying-filters

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/types/index.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/types/index.ts#L29)

Maximum number of records to return

#### Inherited from

[`PaginationOptions`](PaginationOptions.md).[`limit`](PaginationOptions.md#limit)

***

### offset?

> `optional` **offset?**: `number`

Defined in: [core/types/index.ts:31](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/types/index.ts#L31)

Number of records to skip

#### Inherited from

[`PaginationOptions`](PaginationOptions.md).[`offset`](PaginationOptions.md#offset)
