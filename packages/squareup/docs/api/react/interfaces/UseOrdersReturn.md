[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / UseOrdersReturn

# Interface: UseOrdersReturn

Defined in: [src/react/hooks/useOrders.ts:73](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L73)

Return type for useOrders hook

## Extends

- [`MutationState`](MutationState.md)\<[`OrderResponse`](OrderResponse.md)\>

## Properties

### create()

> **create**: (`options`) => `Promise`\<[`OrderResponse`](OrderResponse.md)\>

Defined in: [src/react/hooks/useOrders.ts:75](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L75)

Create a new order

#### Parameters

##### options

[`CreateOrderInput`](CreateOrderInput.md)

#### Returns

`Promise`\<[`OrderResponse`](OrderResponse.md)\>

***

### data

> **data**: [`OrderResponse`](OrderResponse.md) \| `null`

Defined in: [src/react/types.ts:208](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L208)

#### Inherited from

[`MutationState`](MutationState.md).[`data`](MutationState.md#data)

***

### error

> **error**: `Error` \| `null`

Defined in: [src/react/types.ts:209](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L209)

#### Inherited from

[`MutationState`](MutationState.md).[`error`](MutationState.md#error)

***

### get()

> **get**: (`orderId`) => `Promise`\<[`OrderResponse`](OrderResponse.md)\>

Defined in: [src/react/hooks/useOrders.ts:77](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L77)

Get an order by ID

#### Parameters

##### orderId

`string`

#### Returns

`Promise`\<[`OrderResponse`](OrderResponse.md)\>

***

### loading

> **loading**: `boolean`

Defined in: [src/react/types.ts:210](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L210)

#### Inherited from

[`MutationState`](MutationState.md).[`loading`](MutationState.md#loading)

***

### reset()

> **reset**: () => `void`

Defined in: [src/react/hooks/useOrders.ts:79](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L79)

Reset the hook state

#### Returns

`void`
