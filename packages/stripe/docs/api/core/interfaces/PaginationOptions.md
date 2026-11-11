[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaginationOptions

# Interface: PaginationOptions

Defined in: [core/types/index.ts:26](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L26)

Common cursor pagination options

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [core/types/index.ts:28](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L28)

Maximum number of records to return

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/types/index.ts:30](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L30)

Cursor: return records after this object ID (`starting_after`)
