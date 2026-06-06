[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / ListCustomersOptions

# Interface: ListCustomersOptions

Defined in: [core/services/customers.service.ts:94](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L94)

Options for listing customers

## Properties

### cursor?

> `optional` **cursor?**: `string`

Defined in: [core/services/customers.service.ts:96](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L96)

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/customers.service.ts:95](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L95)

***

### sortField?

> `optional` **sortField?**: [`CustomerSortField`](../type-aliases/CustomerSortField.md)

Defined in: [core/services/customers.service.ts:103](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L103)

Field to sort by. Defaults to `DEFAULT` when omitted.

A valid value is always sent to avoid an empty `sort_field=` query
parameter, which the Square API rejects with a 400.

***

### sortOrder?

> `optional` **sortOrder?**: [`CustomerSortOrder`](../type-aliases/CustomerSortOrder.md)

Defined in: [core/services/customers.service.ts:107](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L107)

Sort direction (`ASC` or `DESC`). Only forwarded when provided.
