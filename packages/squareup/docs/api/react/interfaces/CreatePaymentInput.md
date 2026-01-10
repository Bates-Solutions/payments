[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / CreatePaymentInput

# Interface: CreatePaymentInput

Defined in: [src/react/hooks/usePayments.ts:7](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L7)

Payment creation options for the hook

## Properties

### amount

> **amount**: `number`

Defined in: [src/react/hooks/usePayments.ts:11](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L11)

Amount in smallest currency unit (cents for USD)

***

### autocomplete?

> `optional` **autocomplete**: `boolean`

Defined in: [src/react/hooks/usePayments.ts:23](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L23)

Whether to auto-complete the payment

***

### currency?

> `optional` **currency**: `string`

Defined in: [src/react/hooks/usePayments.ts:13](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L13)

Currency code

***

### customerId?

> `optional` **customerId**: `string`

Defined in: [src/react/hooks/usePayments.ts:15](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L15)

Customer ID to associate with payment

***

### note?

> `optional` **note**: `string`

Defined in: [src/react/hooks/usePayments.ts:21](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L21)

Note for the payment

***

### orderId?

> `optional` **orderId**: `string`

Defined in: [src/react/hooks/usePayments.ts:17](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L17)

Order ID to associate with payment

***

### referenceId?

> `optional` **referenceId**: `string`

Defined in: [src/react/hooks/usePayments.ts:19](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L19)

Reference ID for external tracking

***

### sourceId

> **sourceId**: `string`

Defined in: [src/react/hooks/usePayments.ts:9](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L9)

Payment source token from card tokenization
