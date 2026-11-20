[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareClient

# Class: SquareClient

Defined in: [squareup/src/core/client.ts:68](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L68)

Main Square client wrapper

## Example

```typescript
const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
  locationId: 'LXXX',
});

// Create a payment
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000, // $10.00
  idempotencyKey: createIdempotencyKey(),
});
```

## Constructors

### Constructor

> **new SquareClient**(`config`): `SquareClient`

Defined in: [squareup/src/core/client.ts:95](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L95)

#### Parameters

##### config

[`SquareClientConfig`](../interfaces/SquareClientConfig.md)

#### Returns

`SquareClient`

## Properties

### cards

> `readonly` **cards**: [`CardsService`](CardsService.md)

Defined in: [squareup/src/core/client.ts:76](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L76)

Cards on file (`cards.create()`, `get`, `list`, `disable`)

***

### catalog

> `readonly` **catalog**: [`CatalogService`](CatalogService.md)

Defined in: [squareup/src/core/client.ts:82](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L82)

***

### checkout

> `readonly` **checkout**: [`CheckoutService`](CheckoutService.md)

Defined in: [squareup/src/core/client.ts:87](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L87)

***

### customerGroups

> `readonly` **customerGroups**: [`CustomerGroupsService`](CustomerGroupsService.md)

Defined in: [squareup/src/core/client.ts:81](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L81)

***

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

Defined in: [squareup/src/core/client.ts:80](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L80)

***

### giftCards

> `readonly` **giftCards**: [`GiftCardsService`](GiftCardsService.md)

Defined in: [squareup/src/core/client.ts:88](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L88)

***

### inventory

> `readonly` **inventory**: [`InventoryService`](InventoryService.md)

Defined in: [squareup/src/core/client.ts:83](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L83)

***

### invoices

> `readonly` **invoices**: [`InvoicesService`](InvoicesService.md)

Defined in: [squareup/src/core/client.ts:85](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L85)

***

### locations

> `readonly` **locations**: [`LocationsService`](LocationsService.md)

Defined in: [squareup/src/core/client.ts:89](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L89)

***

### loyalty

> `readonly` **loyalty**: [`LoyaltyService`](LoyaltyService.md)

Defined in: [squareup/src/core/client.ts:86](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L86)

***

### oauth

> `readonly` **oauth**: [`OAuthService`](OAuthService.md)

Defined in: [squareup/src/core/client.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L91)

OAuth token status for this client's access token (`oauth.tokenStatus()`)

***

### orders

> `readonly` **orders**: [`OrdersService`](OrdersService.md)

Defined in: [squareup/src/core/client.ts:79](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L79)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [squareup/src/core/client.ts:74](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L74)

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

Defined in: [squareup/src/core/client.ts:78](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L78)

Refunds (`refunds.refundPayment()`, `get`, `list`)

***

### subscriptions

> `readonly` **subscriptions**: [`SubscriptionsService`](SubscriptionsService.md)

Defined in: [squareup/src/core/client.ts:84](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L84)

***

### webhooks

> `readonly` **webhooks**: `object`

Defined in: [squareup/src/core/client.ts:93](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L93)

Webhook subscription management (`webhooks.subscriptions.*`)

#### subscriptions

> **subscriptions**: [`WebhookSubscriptionsService`](WebhookSubscriptionsService.md)

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

Defined in: [squareup/src/core/client.ts:160](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L160)

Get the current environment

##### Returns

[`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

***

### locationId

#### Get Signature

> **get** **locationId**(): `string` \| `undefined`

Defined in: [squareup/src/core/client.ts:153](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L153)

Get the current location ID

##### Returns

`string` \| `undefined`

***

### sdk

#### Get Signature

> **get** **sdk**(): `SquareClient`

Defined in: [squareup/src/core/client.ts:146](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L146)

Get the underlying Square SDK client
Use this for advanced operations not covered by the wrapper

##### Returns

`SquareClient`
