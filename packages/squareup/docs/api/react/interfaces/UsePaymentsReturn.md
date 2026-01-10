[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / UsePaymentsReturn

# Interface: UsePaymentsReturn

Defined in: [src/react/hooks/usePayments.ts:57](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L57)

Return type for usePayments hook

## Extends

- [`MutationState`](MutationState.md)\<[`PaymentResponse`](PaymentResponse.md)\>

## Properties

### create()

> **create**: (`options`) => `Promise`\<[`PaymentResponse`](PaymentResponse.md)\>

Defined in: [src/react/hooks/usePayments.ts:59](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L59)

Create a new payment

#### Parameters

##### options

[`CreatePaymentInput`](CreatePaymentInput.md)

#### Returns

`Promise`\<[`PaymentResponse`](PaymentResponse.md)\>

***

### data

> **data**: [`PaymentResponse`](PaymentResponse.md) \| `null`

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

### loading

> **loading**: `boolean`

Defined in: [src/react/types.ts:210](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L210)

#### Inherited from

[`MutationState`](MutationState.md).[`loading`](MutationState.md#loading)

***

### reset()

> **reset**: () => `void`

Defined in: [src/react/hooks/usePayments.ts:61](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L61)

Reset the hook state

#### Returns

`void`
