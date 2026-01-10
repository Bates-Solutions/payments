[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / UseOrdersOptions

# Interface: UseOrdersOptions

Defined in: [src/react/hooks/useOrders.ts:61](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L61)

Options for useOrders hook

## Properties

### apiEndpoint?

> `optional` **apiEndpoint**: `string`

Defined in: [src/react/hooks/useOrders.ts:63](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L63)

API endpoint for orders (default: /api/orders)

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/react/hooks/useOrders.ts:67](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L67)

Callback on order error

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`order`) => `void`

Defined in: [src/react/hooks/useOrders.ts:65](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useOrders.ts#L65)

Callback on successful order creation

#### Parameters

##### order

[`OrderResponse`](OrderResponse.md)

#### Returns

`void`
