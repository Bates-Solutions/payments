[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CardsService

# Class: CardsService

Defined in: [squareup/src/core/services/cards.service.ts:20](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/cards.service.ts#L20)

Cards on file: store a customer's card, then charge it later with
`payments.create({ sourceId: card.id, customerId, ... })`.

## Example

```typescript
const card = await square.cards.create({
  sourceId: 'cnon:card-nonce-ok',
  customerId: 'CUST_123',
  idempotencyKey: createIdempotencyKey(),
});

await square.cards.disable(card.id!);
```

## Constructors

### Constructor

> **new CardsService**(`client`): `CardsService`

Defined in: [squareup/src/core/services/cards.service.ts:21](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/cards.service.ts#L21)

#### Parameters

##### client

`SquareClient`

#### Returns

`CardsService`

## Methods

### create()

> **create**(`options`): `Promise`\<[`Card`](../interfaces/Card.md)\>

Defined in: [squareup/src/core/services/cards.service.ts:44](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/cards.service.ts#L44)

Store a card on file for a customer

#### Parameters

##### options

[`CreateCardOptions`](../interfaces/CreateCardOptions.md)

Card creation options

#### Returns

`Promise`\<[`Card`](../interfaces/Card.md)\>

The stored card

#### Throws

When `sourceId`, `customerId` or `idempotencyKey` is missing

#### Throws

When Square declines to store the card

#### Example

```typescript
const card = await square.cards.create({
  sourceId: 'cnon:card-nonce-ok',
  customerId: 'CUST_123',
  idempotencyKey: 'store-card-user-42',
  cardholderName: 'Amelia Earhart',
  billingAddress: { postalCode: '94103', country: 'US' },
  referenceId: 'user-42',
});
```

***

### disable()

> **disable**(`cardId`): `Promise`\<[`Card`](../interfaces/Card.md)\>

Defined in: [squareup/src/core/services/cards.service.ts:141](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/cards.service.ts#L141)

Disable a card on file. A disabled card cannot be charged or enabled again.

#### Parameters

##### cardId

`string`

Card ID

#### Returns

`Promise`\<[`Card`](../interfaces/Card.md)\>

The disabled card (`enabled: false`)

#### Example

```typescript
await square.cards.disable('ccof:CARD_123');
```

***

### get()

> **get**(`cardId`): `Promise`\<[`Card`](../interfaces/Card.md)\>

Defined in: [squareup/src/core/services/cards.service.ts:83](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/cards.service.ts#L83)

Get a card by ID

#### Parameters

##### cardId

`string`

Card ID

#### Returns

`Promise`\<[`Card`](../interfaces/Card.md)\>

Card details

#### Example

```typescript
const card = await square.cards.get('ccof:CARD_123');
```

***

### list()

> **list**(`options?`): `Promise`\<\{ `cards`: [`Card`](../interfaces/Card.md)[]; `cursor?`: `string`; \}\>

Defined in: [squareup/src/core/services/cards.service.ts:112](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/cards.service.ts#L112)

List cards on file, one page at a time

#### Parameters

##### options?

[`ListCardsOptions`](../interfaces/ListCardsOptions.md)

Filters and the cursor of the page to fetch

#### Returns

`Promise`\<\{ `cards`: [`Card`](../interfaces/Card.md)[]; `cursor?`: `string`; \}\>

One page of cards, and the cursor of the next page if there is one

#### Example

```typescript
const page1 = await square.cards.list({ customerId: 'CUST_123' });
const page2 = await square.cards.list({ customerId: 'CUST_123', cursor: page1.cursor });
```
