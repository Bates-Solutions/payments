[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / UseCustomersOptions

# Interface: UseCustomersOptions

Defined in: [src/react/hooks/useCustomers.ts:52](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCustomers.ts#L52)

Options for useCustomers hook

## Properties

### apiEndpoint?

> `optional` **apiEndpoint**: `string`

Defined in: [src/react/hooks/useCustomers.ts:54](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCustomers.ts#L54)

API endpoint for customers (default: /api/customers)

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/react/hooks/useCustomers.ts:58](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCustomers.ts#L58)

Callback on error

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`customer`) => `void`

Defined in: [src/react/hooks/useCustomers.ts:56](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCustomers.ts#L56)

Callback on successful operation

#### Parameters

##### customer

[`CustomerResponse`](CustomerResponse.md)

#### Returns

`void`
