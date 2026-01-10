[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / Card

# Interface: Card

Defined in: [src/react/types.ts:49](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L49)

## Properties

### addEventListener()

> **addEventListener**: (`event`, `callback`) => `void`

Defined in: [src/react/types.ts:55](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L55)

#### Parameters

##### event

`CardEventType`

##### callback

`CardEventCallback`

#### Returns

`void`

***

### attach()

> **attach**: (`element`) => `Promise`\<`void`\>

Defined in: [src/react/types.ts:50](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L50)

#### Parameters

##### element

`string` | `HTMLElement`

#### Returns

`Promise`\<`void`\>

***

### configure()

> **configure**: (`options`) => `Promise`\<`void`\>

Defined in: [src/react/types.ts:54](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L54)

#### Parameters

##### options

[`CardOptions`](CardOptions.md)

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**: () => `Promise`\<`void`\>

Defined in: [src/react/types.ts:52](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L52)

#### Returns

`Promise`\<`void`\>

***

### detach()

> **detach**: () => `Promise`\<`void`\>

Defined in: [src/react/types.ts:51](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L51)

#### Returns

`Promise`\<`void`\>

***

### removeEventListener()

> **removeEventListener**: (`event`, `callback`) => `void`

Defined in: [src/react/types.ts:56](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L56)

#### Parameters

##### event

`CardEventType`

##### callback

`CardEventCallback`

#### Returns

`void`

***

### tokenize()

> **tokenize**: () => `Promise`\<[`TokenResult`](TokenResult.md)\>

Defined in: [src/react/types.ts:53](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L53)

#### Returns

`Promise`\<[`TokenResult`](TokenResult.md)\>
