[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / CardInputProps

# Interface: CardInputProps

Defined in: [src/react/components/CardInput.tsx:8](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L8)

Props for CardInput component

## Properties

### cardOptions?

> `optional` **cardOptions**: [`CardOptions`](CardOptions.md)

Defined in: [src/react/components/CardInput.tsx:10](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L10)

Card input styling options

***

### className?

> `optional` **className**: `string`

Defined in: [src/react/components/CardInput.tsx:12](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L12)

Additional CSS class name

***

### onCardBrandChanged()?

> `optional` **onCardBrandChanged**: (`brand`) => `void`

Defined in: [src/react/components/CardInput.tsx:20](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L20)

Callback when card brand changes

#### Parameters

##### brand

`string`

#### Returns

`void`

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/react/components/CardInput.tsx:18](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L18)

Callback when an error occurs

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onReady()?

> `optional` **onReady**: () => `void`

Defined in: [src/react/components/CardInput.tsx:16](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L16)

Callback when card is ready

#### Returns

`void`

***

### style?

> `optional` **style**: `CSSProperties`

Defined in: [src/react/components/CardInput.tsx:14](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L14)

Inline styles for the container
