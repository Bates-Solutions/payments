[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / UseSquarePaymentOptions

# Interface: UseSquarePaymentOptions

Defined in: [src/react/hooks/useSquarePayment.ts:8](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useSquarePayment.ts#L8)

Options for useSquarePayment hook

## Properties

### cardOptions?

> `optional` **cardOptions**: [`CardOptions`](CardOptions.md)

Defined in: [src/react/hooks/useSquarePayment.ts:10](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useSquarePayment.ts#L10)

Card input styling options

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/react/hooks/useSquarePayment.ts:16](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useSquarePayment.ts#L16)

Callback when an error occurs

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onReady()?

> `optional` **onReady**: () => `void`

Defined in: [src/react/hooks/useSquarePayment.ts:12](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useSquarePayment.ts#L12)

Callback when card is ready

#### Returns

`void`

***

### onTokenize()?

> `optional` **onTokenize**: (`token`) => `void`

Defined in: [src/react/hooks/useSquarePayment.ts:14](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useSquarePayment.ts#L14)

Callback when tokenization succeeds

#### Parameters

##### token

`string`

#### Returns

`void`
