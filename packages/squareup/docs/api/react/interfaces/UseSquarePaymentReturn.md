[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / UseSquarePaymentReturn

# Interface: UseSquarePaymentReturn

Defined in: [src/react/types.ts:198](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L198)

Hook state types

## Extends

- [`UseSquarePaymentState`](UseSquarePaymentState.md)

## Properties

### card

> **card**: [`Card`](Card.md) \| `null`

Defined in: [src/react/types.ts:201](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L201)

***

### cardRef()

> **cardRef**: (`instance`) => `void` \| () => `VoidOrUndefinedOnly`

Defined in: [src/react/types.ts:199](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L199)

#### Parameters

##### instance

`HTMLDivElement` | `null`

#### Returns

`void` \| () => `VoidOrUndefinedOnly`

***

### error

> **error**: `Error` \| `null`

Defined in: [src/react/types.ts:194](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L194)

#### Inherited from

[`UseSquarePaymentState`](UseSquarePaymentState.md).[`error`](UseSquarePaymentState.md#error)

***

### loading

> **loading**: `boolean`

Defined in: [src/react/types.ts:195](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L195)

#### Inherited from

[`UseSquarePaymentState`](UseSquarePaymentState.md).[`loading`](UseSquarePaymentState.md#loading)

***

### ready

> **ready**: `boolean`

Defined in: [src/react/types.ts:193](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L193)

#### Inherited from

[`UseSquarePaymentState`](UseSquarePaymentState.md).[`ready`](UseSquarePaymentState.md#ready)

***

### tokenize()

> **tokenize**: () => `Promise`\<`string`\>

Defined in: [src/react/types.ts:200](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L200)

#### Returns

`Promise`\<`string`\>
