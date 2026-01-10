[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / Payments

# Interface: Payments

Defined in: [src/react/types.ts:37](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L37)

Web Payments SDK types
These are simplified types for the Square Web Payments SDK

## Properties

### ach()

> **ach**: (`options?`) => `Promise`\<[`Ach`](Ach.md)\>

Defined in: [src/react/types.ts:42](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L42)

#### Parameters

##### options?

`AchOptions`

#### Returns

`Promise`\<[`Ach`](Ach.md)\>

***

### applePay()

> **applePay**: (`options`) => `Promise`\<[`ApplePay`](ApplePay.md)\>

Defined in: [src/react/types.ts:40](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L40)

#### Parameters

##### options

`ApplePayOptions`

#### Returns

`Promise`\<[`ApplePay`](ApplePay.md)\>

***

### card()

> **card**: (`options?`) => `Promise`\<[`Card`](Card.md)\>

Defined in: [src/react/types.ts:38](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L38)

#### Parameters

##### options?

[`CardOptions`](CardOptions.md)

#### Returns

`Promise`\<[`Card`](Card.md)\>

***

### giftCard()

> **giftCard**: (`options?`) => `Promise`\<[`GiftCard`](GiftCard.md)\>

Defined in: [src/react/types.ts:41](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L41)

#### Parameters

##### options?

`GiftCardOptions`

#### Returns

`Promise`\<[`GiftCard`](GiftCard.md)\>

***

### googlePay()

> **googlePay**: (`options`) => `Promise`\<[`GooglePay`](GooglePay.md)\>

Defined in: [src/react/types.ts:39](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L39)

#### Parameters

##### options

`GooglePayOptions`

#### Returns

`Promise`\<[`GooglePay`](GooglePay.md)\>

***

### verifyBuyer()

> **verifyBuyer**: (`sourceId`, `verificationDetails`) => `Promise`\<[`VerificationResult`](VerificationResult.md)\>

Defined in: [src/react/types.ts:43](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/types.ts#L43)

#### Parameters

##### sourceId

`string`

##### verificationDetails

[`VerificationDetails`](VerificationDetails.md)

#### Returns

`Promise`\<[`VerificationResult`](VerificationResult.md)\>
