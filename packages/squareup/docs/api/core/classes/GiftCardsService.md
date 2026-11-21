[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / GiftCardsService

# Class: GiftCardsService

Defined in: [squareup/src/core/services/gift-cards.service.ts:396](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L396)

Service for managing Square gift cards — issuance, lookup, customer linking.

Activities (activate, load, redeem, deactivate, etc.) are accessed via
`square.giftCards.activities`. Convenience helpers (`activate`, `load`,
`redeem`, `deactivate`) are also exposed directly on this service for the
common cases.

## Example

```typescript
// Issue a digital card and activate it with $25
const card = await square.giftCards.create({ type: 'DIGITAL' });
await square.giftCards.activate(card.id!, 2500);
```

## Constructors

### Constructor

> **new GiftCardsService**(`client`, `defaultLocationId?`, `defaultCurrency?`): `GiftCardsService`

Defined in: [squareup/src/core/services/gift-cards.service.ts:399](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L399)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

##### defaultCurrency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"` = `'USD'`

#### Returns

`GiftCardsService`

## Properties

### activities

> `readonly` **activities**: [`GiftCardActivitiesService`](GiftCardActivitiesService.md)

Defined in: [squareup/src/core/services/gift-cards.service.ts:397](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L397)

## Methods

### activate()

> **activate**(`giftCardId`, `amount`, `options?`): `Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:601](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L601)

Activate a `PENDING` gift card with an initial balance. Convenience
wrapper over `activities.create({ type: 'ACTIVATE' })`.

#### Parameters

##### giftCardId

`string`

##### amount

`number` \| `bigint`

##### options?

###### currency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

###### idempotencyKey?

`string`

###### lineItemUid?

`string`

###### locationId?

`string`

###### orderId?

`string`

###### referenceId?

`string`

#### Returns

`Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

***

### create()

> **create**(`options`): `Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:414](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L414)

Create (issue) a new gift card.

New cards are created in `PENDING` state. Call `activate()` (or
`activities.create({ type: 'ACTIVATE' })`) to set an initial balance
before redemption.

#### Parameters

##### options

[`CreateGiftCardOptions`](../interfaces/CreateGiftCardOptions.md)

#### Returns

`Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

***

### deactivate()

> **deactivate**(`giftCardId`, `reason?`, `options?`): `Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:688](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L688)

Deactivate a gift card permanently.

#### Parameters

##### giftCardId

`string`

##### reason?

[`GiftCardDeactivateReason`](../type-aliases/GiftCardDeactivateReason.md) = `'UNKNOWN_REASON'`

##### options?

###### idempotencyKey?

`string`

###### locationId?

`string`

#### Returns

`Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

***

### get()

> **get**(`giftCardId`): `Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:453](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L453)

Get a gift card by ID.

#### Parameters

##### giftCardId

`string`

#### Returns

`Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

***

### getFromGan()

> **getFromGan**(`gan`): `Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:471](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L471)

Get a gift card by GAN (gift card account number).

#### Parameters

##### gan

`string`

#### Returns

`Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

***

### getFromNonce()

> **getFromNonce**(`nonce`): `Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:490](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L490)

Get a gift card from a payment-source nonce (e.g. produced by the
Square Web Payments SDK at checkout).

#### Parameters

##### nonce

`string`

#### Returns

`Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

***

### linkCustomer()

> **linkCustomer**(`giftCardId`, `customerId`): `Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:544](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L544)

Link a gift card to a customer profile. Returns the updated card with the
customer ID added to `customerIds`.

#### Parameters

##### giftCardId

`string`

##### customerId

`string`

#### Returns

`Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

***

### list()

> **list**(`options?`): `Promise`\<\{ `cursor?`: `string`; `giftCards`: [`GiftCard`](../interfaces/GiftCard.md)[]; \}\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:508](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L508)

List gift cards, optionally filtered by type, state, or linked customer.

#### Parameters

##### options?

[`ListGiftCardsOptions`](../interfaces/ListGiftCardsOptions.md)

#### Returns

`Promise`\<\{ `cursor?`: `string`; `giftCards`: [`GiftCard`](../interfaces/GiftCard.md)[]; \}\>

***

### load()

> **load**(`giftCardId`, `amount`, `options?`): `Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:630](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L630)

Load (top up) an active gift card.

#### Parameters

##### giftCardId

`string`

##### amount

`number` \| `bigint`

##### options?

###### currency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

###### idempotencyKey?

`string`

###### lineItemUid?

`string`

###### locationId?

`string`

###### orderId?

`string`

###### referenceId?

`string`

#### Returns

`Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

***

### redeem()

> **redeem**(`giftCardId`, `amount`, `options?`): `Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:661](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L661)

Redeem from a gift card (deduct funds). For payments processed through
the Square Payments API, Square creates the REDEEM activity automatically;
use this only with a custom payment processor.

#### Parameters

##### giftCardId

`string`

##### amount

`number` \| `bigint`

##### options?

###### currency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

###### idempotencyKey?

`string`

###### locationId?

`string`

###### paymentId?

`string`

###### referenceId?

`string`

#### Returns

`Promise`\<[`GiftCardActivity`](../interfaces/GiftCardActivity.md)\>

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: [`GiftCard`](../interfaces/GiftCard.md)[]; \}\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:533](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L533)

Alias for `list()`. Maintained for parity with the issue's proposed shape.

#### Parameters

##### options?

[`ListGiftCardsOptions`](../interfaces/ListGiftCardsOptions.md)

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: [`GiftCard`](../interfaces/GiftCard.md)[]; \}\>

***

### unlinkCustomer()

> **unlinkCustomer**(`giftCardId`, `customerId`): `Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>

Defined in: [squareup/src/core/services/gift-cards.service.ts:572](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/gift-cards.service.ts#L572)

Unlink a customer from a gift card. Returns the updated card.

#### Parameters

##### giftCardId

`string`

##### customerId

`string`

#### Returns

`Promise`\<[`GiftCard`](../interfaces/GiftCard.md)\>
