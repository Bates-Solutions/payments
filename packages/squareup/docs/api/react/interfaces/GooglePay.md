[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / GooglePay

# Interface: GooglePay

Defined in: [src/react/types.ts:59](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L59)

## Properties

### attach()

> **attach**: (`element`, `options?`) => `Promise`\<`void`\>

Defined in: [src/react/types.ts:60](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L60)

#### Parameters

##### element

`string` | `HTMLElement`

##### options?

[`DigitalWalletOptions`](DigitalWalletOptions.md)

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**: () => `Promise`\<`void`\>

Defined in: [src/react/types.ts:61](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L61)

#### Returns

`Promise`\<`void`\>

***

### tokenize()

> **tokenize**: () => `Promise`\<[`TokenResult`](TokenResult.md)\>

Defined in: [src/react/types.ts:62](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L62)

#### Returns

`Promise`\<[`TokenResult`](TokenResult.md)\>
