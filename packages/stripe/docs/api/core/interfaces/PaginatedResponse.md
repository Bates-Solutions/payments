[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: [core/types/index.ts:30](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/types/index.ts#L30)

Common paginated response

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: [core/types/index.ts:31](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/types/index.ts#L31)

***

### hasMore

> **hasMore**: `boolean`

Defined in: [core/types/index.ts:33](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/types/index.ts#L33)

Whether more records are available

***

### nextCursor?

> `optional` **nextCursor?**: `string`

Defined in: [core/types/index.ts:35](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/types/index.ts#L35)

Cursor to pass as `startingAfter` for the next page
