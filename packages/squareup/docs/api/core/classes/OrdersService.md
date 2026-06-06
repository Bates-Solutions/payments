[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrdersService

# Class: OrdersService

Defined in: [core/services/orders.service.ts:25](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L25)

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

Defined in: [core/services/orders.service.ts:26](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L26)

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

Defined in: [core/services/orders.service.ts:47](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L47)

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

> **create**(`options`, `locationId?`): `Promise`\<[`Order`](../interfaces/Order.md)\>

Defined in: [core/services/orders.service.ts:76](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L76)

Create an order directly (without builder)

#### Parameters

##### options

[`CreateOrderOptions`](../interfaces/CreateOrderOptions.md)

Order creation options

##### locationId?

`string`

Optional location ID

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

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

> **get**(`orderId`): `Promise`\<[`Order`](../interfaces/Order.md)\>

Defined in: [core/services/orders.service.ts:130](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L130)

Get an order by ID

#### Parameters

##### orderId

`string`

Order ID

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

Order details

#### Example

```typescript
const order = await square.orders.get('ORDER_123');
```

***

### pay()

> **pay**(`orderId`, `paymentIds`): `Promise`\<[`Order`](../interfaces/Order.md)\>

Defined in: [core/services/orders.service.ts:200](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L200)

Pay for an order

#### Parameters

##### orderId

`string`

Order ID

##### paymentIds

`string`[]

Payment IDs to apply

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

Updated order

#### Example

```typescript
const order = await square.orders.pay('ORDER_123', ['PAYMENT_456']);
```

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: [`Order`](../interfaces/Order.md)[]; \}\>

Defined in: [core/services/orders.service.ts:258](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L258)

Search for orders

#### Parameters

##### options?

[`SearchOrdersOptions`](../interfaces/SearchOrdersOptions.md)

Search options including query filters and sort

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: [`Order`](../interfaces/Order.md)[]; \}\>

Paginated list of orders

#### Example

```typescript
// Simple search
const { data, cursor } = await square.orders.search({
  locationIds: ['LXXX'],
  limit: 10,
});

// Search with filters
const { data } = await square.orders.search({
  locationIds: ['LXXX'],
  query: {
    filter: {
      dateTimeFilter: {
        createdAt: {
          startAt: '2024-01-01T00:00:00Z',
          endAt: '2024-12-31T23:59:59Z',
        },
      },
      stateFilter: {
        states: ['OPEN', 'COMPLETED'],
      },
      fulfillmentFilter: {
        fulfillmentTypes: ['PICKUP', 'SHIPMENT'],
      },
    },
    sort: {
      sortField: 'CREATED_AT',
      sortOrder: 'DESC',
    },
  },
});
```

***

### searchRecent()

> **searchRecent**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: [`Order`](../interfaces/Order.md)[]; \}\>

Defined in: [core/services/orders.service.ts:312](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L312)

Search for recent orders with simplified filter options

#### Parameters

##### options?

[`SearchRecentOrdersOptions`](../interfaces/SearchRecentOrdersOptions.md)

Simplified search options

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: [`Order`](../interfaces/Order.md)[]; \}\>

Paginated list of orders

#### Example

```typescript
// Get completed orders from the last hour
const { data } = await square.orders.searchRecent({
  states: ['COMPLETED'],
  since: new Date(Date.now() - 60 * 60 * 1000),
});

// Get first page of orders from a date range
const { data, cursor } = await square.orders.searchRecent({
  since: new Date('2024-01-01'),
  until: new Date('2024-01-31'),
  limit: 50,
});

// Fetch next page
const page2 = await square.orders.searchRecent({
  since: new Date('2024-01-01'),
  until: new Date('2024-01-31'),
  cursor,
  limit: 50,
});
```

***

### update()

> **update**(`orderId`, `updates`, `locationId?`): `Promise`\<[`Order`](../interfaces/Order.md)\>

Defined in: [core/services/orders.service.ts:151](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/orders.service.ts#L151)

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

`Promise`\<[`Order`](../interfaces/Order.md)\>

Updated order
