[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / LineItemInput

# Interface: LineItemInput

Defined in: [core/types/index.ts:57](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/types/index.ts#L57)

Line item for orders

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: [core/types/index.ts:61](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/types/index.ts#L61)

***

### basePriceMoney?

> `optional` **basePriceMoney?**: `object`

Defined in: [core/types/index.ts:67](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/types/index.ts#L67)

Explicit money override. When set, takes precedence over `amount` + the
builder's default currency. Useful for order templates where the base
price must include an explicit currency.

#### amount

> **amount**: `number` \| `bigint`

#### currency

> **currency**: `"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

***

### catalogObjectId?

> `optional` **catalogObjectId?**: `string`

Defined in: [core/types/index.ts:59](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/types/index.ts#L59)

***

### name?

> `optional` **name?**: `string`

Defined in: [core/types/index.ts:58](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/types/index.ts#L58)

***

### note?

> `optional` **note?**: `string`

Defined in: [core/types/index.ts:71](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/types/index.ts#L71)

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/types/index.ts:60](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/types/index.ts#L60)
