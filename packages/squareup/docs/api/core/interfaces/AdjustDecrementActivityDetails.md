[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / AdjustDecrementActivityDetails

# Interface: AdjustDecrementActivityDetails

Defined in: [squareup/src/core/services/gift-cards.service.ts:150](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L150)

Details of an `ADJUST_DECREMENT` activity: an amount taken off the balance by hand, with the reason.

## Properties

### amountMoney

> **amountMoney**: `object`

Defined in: [squareup/src/core/services/gift-cards.service.ts:151](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L151)

#### amount

> **amount**: `number` \| `bigint`

#### currency

> **currency**: `string`

***

### reason

> **reason**: [`AdjustDecrementReason`](../type-aliases/AdjustDecrementReason.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:152](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L152)
