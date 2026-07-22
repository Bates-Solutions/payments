[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / WebhookEvent

# Interface: WebhookEvent

Defined in: server/types.ts:8

A parsed Clover webhook event.

Clover webhook payloads vary by product (Hosted Checkout vs platform app
webhooks), so the event is kept generic — dispatch is keyed off an optional
`type` field when present.

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### type?

> `optional` **type?**: `string`

Defined in: server/types.ts:10

Event type, when the payload carries one
