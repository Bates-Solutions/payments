[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / AdjustIncrementActivityDetails

# Interface: AdjustIncrementActivityDetails

Defined in: [squareup/src/core/services/gift-cards.service.ts:144](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L144)

Details of an `ADJUST_INCREMENT` activity: an amount added to the balance by hand, with the reason.

## Properties

### amountMoney

> **amountMoney**: `object`

Defined in: [squareup/src/core/services/gift-cards.service.ts:145](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L145)

#### amount

> **amount**: `number` \| `bigint`

#### currency

> **currency**: `string`

***

### reason

> **reason**: [`AdjustIncrementReason`](../type-aliases/AdjustIncrementReason.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:146](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L146)
