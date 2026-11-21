[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateGiftCardActivityOptions

# Interface: CreateGiftCardActivityOptions

Defined in: [squareup/src/core/services/gift-cards.service.ts:195](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L195)

Options for creating a gift card activity.

Specify exactly one of `giftCardId` or `giftCardGan` to identify the card.
Provide the corresponding `*ActivityDetails` field for the chosen `type`
(e.g. `activateActivityDetails` for `'ACTIVATE'`).

## Properties

### activateActivityDetails?

> `optional` **activateActivityDetails?**: [`ActivateActivityDetails`](ActivateActivityDetails.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:204](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L204)

***

### adjustDecrementActivityDetails?

> `optional` **adjustDecrementActivityDetails?**: [`AdjustDecrementActivityDetails`](AdjustDecrementActivityDetails.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:210](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L210)

***

### adjustIncrementActivityDetails?

> `optional` **adjustIncrementActivityDetails?**: [`AdjustIncrementActivityDetails`](AdjustIncrementActivityDetails.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:209](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L209)

***

### clearBalanceActivityDetails?

> `optional` **clearBalanceActivityDetails?**: `object`

Defined in: [squareup/src/core/services/gift-cards.service.ts:207](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L207)

#### reason?

> `optional` **reason?**: `string`

***

### deactivateActivityDetails?

> `optional` **deactivateActivityDetails?**: `object`

Defined in: [squareup/src/core/services/gift-cards.service.ts:208](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L208)

#### reason?

> `optional` **reason?**: [`GiftCardDeactivateReason`](../type-aliases/GiftCardDeactivateReason.md)

***

### giftCardGan?

> `optional` **giftCardGan?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:203](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L203)

***

### giftCardId?

> `optional` **giftCardId?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:202](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L202)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:211](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L211)

***

### loadActivityDetails?

> `optional` **loadActivityDetails?**: [`LoadActivityDetails`](LoadActivityDetails.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:205](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L205)

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:201](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L201)

Location where the activity occurred. Defaults to the client's configured
location ID.

***

### redeemActivityDetails?

> `optional` **redeemActivityDetails?**: [`RedeemActivityDetails`](RedeemActivityDetails.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:206](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L206)

***

### type

> **type**: [`GiftCardActivityType`](../type-aliases/GiftCardActivityType.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:196](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L196)
