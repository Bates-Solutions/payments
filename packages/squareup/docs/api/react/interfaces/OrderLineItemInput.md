[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / OrderLineItemInput

# Interface: OrderLineItemInput

Defined in: [src/react/hooks/useOrders.ts:7](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L7)

Line item input for order creation

## Properties

### amount?

> `optional` **amount**: `number`

Defined in: [src/react/hooks/useOrders.ts:15](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L15)

Amount in smallest currency unit (required for ad-hoc items)

***

### catalogObjectId?

> `optional` **catalogObjectId**: `string`

Defined in: [src/react/hooks/useOrders.ts:11](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L11)

Catalog object ID (for catalog items)

***

### name?

> `optional` **name**: `string`

Defined in: [src/react/hooks/useOrders.ts:9](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L9)

Item name (for ad-hoc items)

***

### note?

> `optional` **note**: `string`

Defined in: [src/react/hooks/useOrders.ts:17](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L17)

Item note

***

### quantity?

> `optional` **quantity**: `number`

Defined in: [src/react/hooks/useOrders.ts:13](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L13)

Quantity (default: 1)
