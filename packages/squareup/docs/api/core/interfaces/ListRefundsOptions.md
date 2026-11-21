[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / ListRefundsOptions

# Interface: ListRefundsOptions

Defined in: [squareup/src/core/types/index.ts:416](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L416)

Options for `refunds.list()`.

## Properties

### beginTime?

> `optional` **beginTime?**: `string`

Defined in: [squareup/src/core/types/index.ts:418](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L418)

Only refunds created at or after this time (RFC 3339). Default: one year ago.

***

### cursor?

> `optional` **cursor?**: `string`

Defined in: [squareup/src/core/types/index.ts:432](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L432)

The `cursor` from a previous page.

***

### endTime?

> `optional` **endTime?**: `string`

Defined in: [squareup/src/core/types/index.ts:420](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L420)

Only refunds created before this time (RFC 3339). Default: now.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [squareup/src/core/types/index.ts:430](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L430)

Page size (Square caps it at 100).

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [squareup/src/core/types/index.ts:424](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L424)

Only refunds at this location. Default: every location.

***

### sortOrder?

> `optional` **sortOrder?**: `"ASC"` \| `"DESC"`

Defined in: [squareup/src/core/types/index.ts:422](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L422)

Order by creation time. Default `DESC` (newest first).

***

### sourceType?

> `optional` **sourceType?**: `string`

Defined in: [squareup/src/core/types/index.ts:428](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L428)

Only refunds of payments with this source type, for example `CARD`.

***

### status?

> `optional` **status?**: `string`

Defined in: [squareup/src/core/types/index.ts:426](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L426)

Only refunds with this status, for example `COMPLETED`.
