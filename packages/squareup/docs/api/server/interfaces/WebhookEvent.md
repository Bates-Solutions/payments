[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / WebhookEvent

# Interface: WebhookEvent\<T\>

Defined in: [src/server/types.ts:74](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/types.ts#L74)

Base webhook event structure

## Type Parameters

### T

`T` = `unknown`

## Properties

### created\_at

> **created\_at**: `string`

Defined in: [src/server/types.ts:82](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/types.ts#L82)

When the event was created

***

### data

> **data**: `object`

Defined in: [src/server/types.ts:84](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/types.ts#L84)

Event data payload

#### id

> **id**: `string`

Unique ID of the object

#### object

> **object**: `T`

The actual object data

#### type

> **type**: `string`

Type of object in the event

***

### event\_id

> **event\_id**: `string`

Defined in: [src/server/types.ts:76](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/types.ts#L76)

Unique ID for this event

***

### merchant\_id

> **merchant\_id**: `string`

Defined in: [src/server/types.ts:78](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/types.ts#L78)

Merchant ID that triggered the event

***

### type

> **type**: [`WebhookEventType`](../type-aliases/WebhookEventType.md)

Defined in: [src/server/types.ts:80](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/server/types.ts#L80)

Type of event
