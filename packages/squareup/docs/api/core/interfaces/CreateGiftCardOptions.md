[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateGiftCardOptions

# Interface: CreateGiftCardOptions

Defined in: [squareup/src/core/services/gift-cards.service.ts:165](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L165)

Options for creating a gift card.

GAN handling:
- Omit `gan` and `ganSource` to let Square generate a 16-digit GAN.
- Set `ganSource: 'OTHER'` and provide a custom `gan` (8–20 alphanumeric
  characters) for application-supplied GANs.
- For unactivated physical cards previously ordered from Square, provide
  only `gan` (the printed value); leave `ganSource` unset.

## Properties

### gan?

> `optional` **gan?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:172](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L172)

***

### ganSource?

> `optional` **ganSource?**: [`GiftCardGanSource`](../type-aliases/GiftCardGanSource.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:173](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L173)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:174](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L174)

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [squareup/src/core/services/gift-cards.service.ts:171](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L171)

Location to register the card under. Defaults to the client's configured
location ID.

***

### type

> **type**: [`GiftCardType`](../type-aliases/GiftCardType.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:166](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L166)
