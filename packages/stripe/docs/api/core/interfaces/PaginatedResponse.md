[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: [core/types/index.ts:30](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/types/index.ts#L30)

Common paginated response

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: [core/types/index.ts:31](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/types/index.ts#L31)

***

### hasMore

> **hasMore**: `boolean`

Defined in: [core/types/index.ts:33](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/types/index.ts#L33)

Whether more records are available

***

### nextCursor?

> `optional` **nextCursor?**: `string`

Defined in: [core/types/index.ts:35](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/types/index.ts#L35)

Cursor to pass as `startingAfter` for the next page
