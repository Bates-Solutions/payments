[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / OrdersService

# Class: OrdersService

Defined in: [core/services/orders.service.ts:251](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L251)

Orders service wrapping Clover's Platform
[orders](https://docs.clover.com/dev/reference/ordergetorders) API
(`/v3/merchants/{mId}/orders`). Read only for now.

Requires a `merchantId` on the client.

## Example

```typescript
const { data: orders } = await clover.orders.list({
  createdTimeFrom: new Date('2026-10-01'),
  createdTimeTo: new Date('2026-11-01'),
  expand: ['lineItems'],
});
```

## Constructors

### Constructor

> **new OrdersService**(`http`): `OrdersService`

Defined in: [core/services/orders.service.ts:252](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L252)

#### Parameters

##### http

[`CloverHttp`](CloverHttp.md)

#### Returns

`OrdersService`

## Methods

### get()

> **get**(`orderId`, `options?`): `Promise`\<[`Order`](../interfaces/Order.md)\>

Defined in: [core/services/orders.service.ts:347](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L347)

Retrieve an order by ID.

#### Parameters

##### orderId

`string`

##### options?

[`GetOrderOptions`](../interfaces/GetOrderOptions.md)

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

#### Example

```typescript
const order = await clover.orders.get('ORDER_1', { expand: ['lineItems'] });
```

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Order`](../interfaces/Order.md)\>\>

Defined in: [core/services/orders.service.ts:294](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L294)

List orders with offset-based pagination, optionally in a creation time
window and with line items. Clover returns 100 orders per page by
default and at most 1000; keep requesting with a larger `offset` while
a page comes back full.

Clover's reference says results are "restricted to the last 90 days"
when the filter includes `createdTime`, `state`, `total`, `payType`,
`title`, `note`, `externalReferenceId`, `deletedTime`,
`manualTransaction`, `cardTransaction.last4`, `testMode` or `touched`.
This library does not enforce or work around that (not verified against
a sandbox).

#### Parameters

##### options?

[`ListOrdersOptions`](../interfaces/ListOrdersOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Order`](../interfaces/Order.md)\>\>

#### Throws

When a time is invalid,
  `createdTimeFrom` is not before `createdTimeTo`, `state` is empty,
  `limit` is outside 1 to 1000, or `offset` is negative

#### Example

```typescript
const { data } = await clover.orders.list({
  createdTimeFrom: Date.now() - 7 * 24 * 60 * 60 * 1000,
  expand: ['lineItems'],
  limit: 100,
});
for (const order of data) {
  for (const line of order.lineItems ?? []) console.log(line.item?.id, line.price);
}
```
