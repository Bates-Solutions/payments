[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverClient

# Class: CloverClient

Defined in: [core/client.ts:46](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L46)

Main Clover client wrapper.

## Example

```typescript
const clover = createCloverClient({
  apiToken: process.env.CLOVER_API_TOKEN!,
  merchantId: process.env.CLOVER_MERCHANT_ID,
  environment: 'sandbox',
});

const charge = await clover.payments.create({
  amount: 1000, // $10.00
  source: 'clv_1TSTStok...',
});
```

## Constructors

### Constructor

> **new CloverClient**(`config`): `CloverClient`

Defined in: [core/client.ts:56](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L56)

#### Parameters

##### config

[`CloverClientConfig`](../interfaces/CloverClientConfig.md)

#### Returns

`CloverClient`

## Properties

### customers

> `readonly` **customers**: [`CustomersService`](CustomersService.md)

Defined in: [core/client.ts:53](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L53)

***

### inventory

> `readonly` **inventory**: [`InventoryService`](InventoryService.md)

Defined in: [core/client.ts:54](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L54)

***

### orders

> `readonly` **orders**: [`OrdersService`](OrdersService.md)

Defined in: [core/client.ts:52](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L52)

***

### payments

> `readonly` **payments**: [`PaymentsService`](PaymentsService.md)

Defined in: [core/client.ts:50](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L50)

***

### refunds

> `readonly` **refunds**: [`RefundsService`](RefundsService.md)

Defined in: [core/client.ts:51](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L51)

## Accessors

### environment

#### Get Signature

> **get** **environment**(): [`CloverEnvironment`](../type-aliases/CloverEnvironment.md)

Defined in: [core/client.ts:79](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L79)

The environment this client operates in.

##### Returns

[`CloverEnvironment`](../type-aliases/CloverEnvironment.md)

***

### merchantId

#### Get Signature

> **get** **merchantId**(): `string` \| `undefined`

Defined in: [core/client.ts:86](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/client.ts#L86)

The configured merchant id, if any.

##### Returns

`string` \| `undefined`
