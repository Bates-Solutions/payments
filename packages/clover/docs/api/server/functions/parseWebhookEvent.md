[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / parseWebhookEvent

# Function: parseWebhookEvent()

> **parseWebhookEvent**(`rawBody`): [`WebhookEvent`](../interfaces/WebhookEvent.md)

Defined in: [server/webhook.ts:136](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/webhook.ts#L136)

Parse a webhook request body into an event.

## Parameters

### rawBody

`string`

## Returns

[`WebhookEvent`](../interfaces/WebhookEvent.md)

## Throws

Error if the payload is not valid JSON
