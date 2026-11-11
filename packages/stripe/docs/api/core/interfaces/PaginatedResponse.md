[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: [core/types/index.ts:57](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/types/index.ts#L57)

Common paginated response

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: [core/types/index.ts:58](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/types/index.ts#L58)

***

### hasMore

> **hasMore**: `boolean`

Defined in: [core/types/index.ts:60](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/types/index.ts#L60)

Whether more records are available

***

### nextCursor?

> `optional` **nextCursor?**: `string`

Defined in: [core/types/index.ts:62](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/types/index.ts#L62)

Cursor to pass as `startingAfter` for the next page
