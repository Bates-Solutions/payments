[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: [stripe/src/core/types/index.ts:57](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/types/index.ts#L57)

Common paginated response

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: [stripe/src/core/types/index.ts:58](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/types/index.ts#L58)

***

### hasMore

> **hasMore**: `boolean`

Defined in: [stripe/src/core/types/index.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/types/index.ts#L60)

Whether more records are available

***

### nextCursor?

> `optional` **nextCursor?**: `string`

Defined in: [stripe/src/core/types/index.ts:62](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/types/index.ts#L62)

Cursor to pass as `startingAfter` for the next page
