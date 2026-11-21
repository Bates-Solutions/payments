[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / RedeemActivityDetails

# Interface: RedeemActivityDetails

Defined in: [squareup/src/core/services/gift-cards.service.ts:136](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L136)

Details of a `REDEEM` activity: the amount spent from the card, and the payment it paid for.

## Properties

### amountMoney

> **amountMoney**: `object`

Defined in: [squareup/src/core/services/gift-cards.service.ts:137](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L137)

#### amount?

> `optional` **amount?**: `bigint`

#### currency?

> `optional` **currency?**: `string`

***

### paymentId?

> `optional` **paymentId?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:138](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L138)

***

### referenceId?

> `optional` **referenceId?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:139](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L139)

***

### status?

> `optional` **status?**: `"COMPLETED"` \| `"CANCELED"` \| `"PENDING"`

Defined in: [squareup/src/core/services/gift-cards.service.ts:140](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L140)
