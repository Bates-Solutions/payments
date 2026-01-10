[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / ApplePay

# Interface: ApplePay

Defined in: [src/react/types.ts:65](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L65)

## Properties

### attach()

> **attach**: (`element`, `options?`) => `Promise`\<`void`\>

Defined in: [src/react/types.ts:66](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L66)

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

Defined in: [src/react/types.ts:67](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L67)

#### Returns

`Promise`\<`void`\>

***

### tokenize()

> **tokenize**: () => `Promise`\<[`TokenResult`](TokenResult.md)\>

Defined in: [src/react/types.ts:68](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L68)

#### Returns

`Promise`\<[`TokenResult`](TokenResult.md)\>
