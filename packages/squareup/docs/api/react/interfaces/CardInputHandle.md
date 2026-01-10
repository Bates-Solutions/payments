[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / CardInputHandle

# Interface: CardInputHandle

Defined in: [src/react/components/CardInput.tsx:26](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L26)

CardInput imperative handle

## Properties

### error

> **error**: `Error` \| `null`

Defined in: [src/react/components/CardInput.tsx:32](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L32)

Current error, if any

***

### loading

> **loading**: `boolean`

Defined in: [src/react/components/CardInput.tsx:34](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L34)

Whether tokenization is in progress

***

### ready

> **ready**: `boolean`

Defined in: [src/react/components/CardInput.tsx:30](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L30)

Whether the card is ready

***

### tokenize()

> **tokenize**: () => `Promise`\<`string`\>

Defined in: [src/react/components/CardInput.tsx:28](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L28)

Tokenize the card input

#### Returns

`Promise`\<`string`\>
