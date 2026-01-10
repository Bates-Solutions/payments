[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrdersService

# Class: OrdersService

Defined in: [src/core/services/orders.service.ts:25](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L25)

Orders service for managing Square orders

## Example

```typescript
// Using the builder (recommended)
const order = await square.orders
  .builder()
  .addItem({ name: 'Latte', amount: 450 })
  .withCustomer('CUST_123')
  .build();

// Or create directly
const order = await square.orders.create({
  lineItems: [{ name: 'Latte', amount: 450 }],
});
```

## Constructors

### Constructor

> **new OrdersService**(`client`, `defaultLocationId?`): `OrdersService`

Defined in: [src/core/services/orders.service.ts:26](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L26)

#### Parameters

##### client

`SquareClient`

##### defaultLocationId?

`string`

#### Returns

`OrdersService`

## Methods

### builder()

> **builder**(`locationId?`): [`OrderBuilder`](OrderBuilder.md)

Defined in: [src/core/services/orders.service.ts:47](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L47)

Create a new order builder

#### Parameters

##### locationId?

`string`

Optional location ID (uses default if not provided)

#### Returns

[`OrderBuilder`](OrderBuilder.md)

Order builder instance

#### Example

```typescript
const order = await square.orders
  .builder()
  .addItem({ name: 'Coffee', amount: 350 })
  .addItem({ name: 'Muffin', amount: 250 })
  .withTip(100)
  .build();
```

***

### create()

> **create**(`options`, `locationId?`): `Promise`\<`Order`\>

Defined in: [src/core/services/orders.service.ts:76](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L76)

Create an order directly (without builder)

#### Parameters

##### options

[`CreateOrderOptions`](../interfaces/CreateOrderOptions.md)

Order creation options

##### locationId?

`string`

Optional location ID

#### Returns

`Promise`\<`Order`\>

Created order

#### Example

```typescript
const order = await square.orders.create({
  lineItems: [
    { name: 'Coffee', amount: 350 },
    { catalogObjectId: 'ITEM_123', quantity: 2 },
  ],
  customerId: 'CUST_123',
});
```

***

### get()

> **get**(`orderId`): `Promise`\<`Order`\>

Defined in: [src/core/services/orders.service.ts:118](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L118)

Get an order by ID

#### Parameters

##### orderId

`string`

Order ID

#### Returns

`Promise`\<`Order`\>

Order details

#### Example

```typescript
const order = await square.orders.get('ORDER_123');
```

***

### pay()

> **pay**(`orderId`, `paymentIds`): `Promise`\<`Order`\>

Defined in: [src/core/services/orders.service.ts:188](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L188)

Pay for an order

#### Parameters

##### orderId

`string`

Order ID

##### paymentIds

`string`[]

Payment IDs to apply

#### Returns

`Promise`\<`Order`\>

Updated order

#### Example

```typescript
const order = await square.orders.pay('ORDER_123', ['PAYMENT_456']);
```

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: `Order`[]; \}\>

Defined in: [src/core/services/orders.service.ts:220](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L220)

Search for orders

#### Parameters

##### options?

Search options

###### cursor?

`string`

###### limit?

`number`

###### locationIds?

`string`[]

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: `Order`[]; \}\>

Paginated list of orders

#### Example

```typescript
const { data, cursor } = await square.orders.search({
  locationIds: ['LXXX'],
  limit: 10,
});
```

***

### update()

> **update**(`orderId`, `updates`, `locationId?`): `Promise`\<`Order`\>

Defined in: [src/core/services/orders.service.ts:139](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/orders.service.ts#L139)

Update an order

#### Parameters

##### orderId

`string`

Order ID to update

##### updates

Update fields

###### referenceId?

`string`

###### version

`number`

##### locationId?

`string`

#### Returns

`Promise`\<`Order`\>

Updated order
