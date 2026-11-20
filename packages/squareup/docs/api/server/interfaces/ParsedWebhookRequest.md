[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / ParsedWebhookRequest

# Interface: ParsedWebhookRequest

Defined in: [squareup/src/server/types.ts:148](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L148)

Parsed webhook request

## Properties

### event

> **event**: [`WebhookEvent`](WebhookEvent.md)

Defined in: [squareup/src/server/types.ts:154](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L154)

Parsed event data

***

### rawBody

> **rawBody**: `string`

Defined in: [squareup/src/server/types.ts:150](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L150)

The raw request body

***

### signature

> **signature**: `string`

Defined in: [squareup/src/server/types.ts:152](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L152)

The signature from headers
