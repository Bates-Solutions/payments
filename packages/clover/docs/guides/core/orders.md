# Orders

The `orders` service wraps Clover's Platform [orders](https://docs.clover.com/dev/reference/ordergetorders) API (`/v3/merchants/{mId}/orders`). It **requires a `merchantId`** on the client and is read only for now. Amounts are integer cents and times are epoch milliseconds.

## List orders in a time window, with line items

```typescript
const { data: orders } = await clover.orders.list({
  createdTimeFrom: new Date('2026-10-01T00:00:00Z'), // inclusive
  createdTimeTo: new Date('2026-11-01T00:00:00Z'), // exclusive
  expand: ['lineItems'],
  limit: 100,
  offset: 0,
});

for (const order of orders) {
  if (order.paymentState !== 'PAID') continue;
  for (const line of order.lineItems ?? []) {
    console.log(line.item?.id, line.name, line.price);
  }
}
```

- `createdTimeFrom` / `createdTimeTo` take a `Date` or epoch milliseconds and become `createdTime>=…` / `createdTime<…` filters. An invalid time, or a start that is not before the end, throws `CloverValidationError`.
- `state` filters on the order state (e.g. `locked`). `paymentState` is not a filterable field in Clover, so check it on the results as above.
- `filter` adds raw Clover filters (AND), e.g. `['total>1000']`; see [Applying filters](https://docs.clover.com/docs/applying-filters).
- Pagination is offset based, like `customers.list()`.

### The 90 day window

Clover returns at most 90 days of orders per request when you filter on `createdTime`, `state` and several other fields. For longer periods, request consecutive windows of 90 days or less.

## Line items and quantities

`expand: ['lineItems']` embeds the line items. Clover sends them in an `{ elements: [...] }` envelope; the library always gives you a plain `lineItems` array.

- `line.item.id` is the inventory item (see the [inventory guide](./inventory.md)); it is absent for custom items.
- `line.price` is the unit price in cents.
- Clover adds **one line item per unit** for normally priced items, so count the lines to get units sold.
- For items sold by weight or measure (`PER_UNIT`), `unitQty` is a fixed-point quantity scaled by 1000: `2500` is 2.5 `unitName`.

## Get one order

```typescript
const order = await clover.orders.get('ORDER_1', { expand: ['lineItems', 'payments'] });
```
