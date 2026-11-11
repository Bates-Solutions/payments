[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / ListOrdersOptions

# Interface: ListOrdersOptions

Defined in: [core/services/orders.service.ts:135](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L135)

Options for `orders.list()`.

## Extends

- [`PaginationOptions`](PaginationOptions.md)

## Properties

### createdTimeFrom?

> `optional` **createdTimeFrom?**: `number` \| `Date`

Defined in: [core/services/orders.service.ts:137](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L137)

Only orders created at or after this time (`Date` or epoch milliseconds)

***

### createdTimeTo?

> `optional` **createdTimeTo?**: `number` \| `Date`

Defined in: [core/services/orders.service.ts:139](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L139)

Only orders created before this time (`Date` or epoch milliseconds)

***

### expand?

> `optional` **expand?**: [`OrderExpand`](../type-aliases/OrderExpand.md)[]

Defined in: [core/services/orders.service.ts:150](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L150)

Related data to embed, e.g. `['lineItems']`

***

### filter?

> `optional` **filter?**: `string`[]

Defined in: [core/services/orders.service.ts:148](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L148)

Extra raw Clover filters, each `field<op>value`, e.g. `['total>1000']`.
Combined with AND with the options above.

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

***

### state?

> `optional` **state?**: `string`

Defined in: [core/services/orders.service.ts:141](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L141)

Only orders in this state, e.g. `locked`. Must not be empty.
