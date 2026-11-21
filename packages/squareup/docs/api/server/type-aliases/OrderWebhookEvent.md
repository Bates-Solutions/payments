[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / OrderWebhookEvent

# Type Alias: OrderWebhookEvent

> **OrderWebhookEvent** = [`WebhookEvent`](../interfaces/WebhookEvent.md)\<[`OrderWebhookObject`](../interfaces/OrderWebhookObject.md)\> & `object`

Defined in: [squareup/src/server/types.ts:220](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L220)

A webhook event for an order, with `type` narrowed to its event types.

## Type Declaration

### type

> **type**: [`OrderEventType`](OrderEventType.md)
