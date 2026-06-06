[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareClient

# Class: SquareClient

Defined in: [core/client.ts:60](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L60)

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
});
```

## Constructors

### Constructor

> **new SquareClient**(`config`): `SquareClient`

Defined in: [core/client.ts:78](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L78)

#### Parameters

##### config

[`SquareClientConfig`](../interfaces/SquareClientConfig.md)

#### Returns

`SquareClient`

## Properties

### catalog

> `readonly` **catalog**: [`CatalogService`](CatalogService.md)

Defined in: [core/client.ts:70](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L70)

***

### checkout

> `readonly` **checkout**: [`CheckoutService`](CheckoutService.md)

Defined in: [core/client.ts:75](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L75)

***

### customerGroups

> `readonly` **customerGroups**: [`CustomerGroupsService`](CustomerGroupsService.md)

Defined in: [core/client.ts:69](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L69)

***

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

Defined in: [core/client.ts:68](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L68)

***

### giftCards

> `readonly` **giftCards**: [`GiftCardsService`](GiftCardsService.md)

Defined in: [core/client.ts:76](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L76)

***

### inventory

> `readonly` **inventory**: [`InventoryService`](InventoryService.md)

Defined in: [core/client.ts:71](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L71)

***

### invoices

> `readonly` **invoices**: [`InvoicesService`](InvoicesService.md)

Defined in: [core/client.ts:73](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L73)

***

### loyalty

> `readonly` **loyalty**: [`LoyaltyService`](LoyaltyService.md)

Defined in: [core/client.ts:74](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L74)

***

### orders

> `readonly` **orders**: [`OrdersService`](OrdersService.md)

Defined in: [core/client.ts:67](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L67)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [core/client.ts:66](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L66)

***

### subscriptions

> `readonly` **subscriptions**: [`SubscriptionsService`](SubscriptionsService.md)

Defined in: [core/client.ts:72](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L72)

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

Defined in: [core/client.ts:126](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L126)

Get the current environment

##### Returns

[`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

***

### locationId

#### Get Signature

> **get** **locationId**(): `string` \| `undefined`

Defined in: [core/client.ts:119](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L119)

Get the current location ID

##### Returns

`string` \| `undefined`

***

### sdk

#### Get Signature

> **get** **sdk**(): `SquareClient`

Defined in: [core/client.ts:112](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/client.ts#L112)

Get the underlying Square SDK client
Use this for advanced operations not covered by the wrapper

##### Returns

`SquareClient`
