[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / UpdateOrderFulfillmentInput

# Interface: UpdateOrderFulfillmentInput

Defined in: [squareup/src/core/types/index.ts:223](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L223)

One fulfillment to change in `orders.update()`, matched on its `uid`.

Moving a `SHIPMENT` fulfillment to `COMPLETED` marks it shipped; Square stamps
`shipmentDetails.shippedAt` itself, so it isn't settable here.

## Properties

### shipmentDetails?

> `optional` **shipmentDetails?**: `object`

Defined in: [squareup/src/core/types/index.ts:228](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L228)

Writable shipment fields; only the ones you set are sent.

#### carrier?

> `optional` **carrier?**: `string`

#### expectedShippedAt?

> `optional` **expectedShippedAt?**: `string`

RFC 3339 timestamp.

#### shippingNote?

> `optional` **shippingNote?**: `string`

#### shippingType?

> `optional` **shippingType?**: `string`

#### trackingNumber?

> `optional` **trackingNumber?**: `string`

#### trackingUrl?

> `optional` **trackingUrl?**: `string`

***

### state?

> `optional` **state?**: `FulfillmentState`

Defined in: [squareup/src/core/types/index.ts:226](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L226)

***

### uid

> **uid**: `string`

Defined in: [squareup/src/core/types/index.ts:225](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L225)

The `uid` of a fulfillment already on the order.
