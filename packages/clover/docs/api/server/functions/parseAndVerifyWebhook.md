[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / parseAndVerifyWebhook

# Function: parseAndVerifyWebhook()

> **parseAndVerifyWebhook**(`rawBody`, `signature`, `signingSecret`, `options?`): `Promise`\<[`ParsedWebhookRequest`](../interfaces/ParsedWebhookRequest.md)\>

Defined in: server/webhook.ts:160

Verify and parse a webhook request.

## Parameters

### rawBody

`string`

### signature

`string`

### signingSecret

`string`

### options?

[`VerifyOptions`](../interfaces/VerifyOptions.md)

## Returns

`Promise`\<[`ParsedWebhookRequest`](../interfaces/ParsedWebhookRequest.md)\>

## Throws

Error if verification or parsing fails
