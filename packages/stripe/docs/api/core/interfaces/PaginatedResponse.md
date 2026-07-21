[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: core/types/index.ts:30

Common paginated response

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: core/types/index.ts:31

***

### hasMore

> **hasMore**: `boolean`

Defined in: core/types/index.ts:33

Whether more records are available

***

### nextCursor?

> `optional` **nextCursor?**: `string`

Defined in: core/types/index.ts:35

Cursor to pass as `startingAfter` for the next page
