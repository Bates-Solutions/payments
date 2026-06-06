[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / parseAndVerifyWebhook

# Function: parseAndVerifyWebhook()

> **parseAndVerifyWebhook**(`rawBody`, `signature`, `signatureKey`, `notificationUrl?`): [`ParsedWebhookRequest`](../interfaces/ParsedWebhookRequest.md)

Defined in: [server/webhook.ts:132](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/webhook.ts#L132)

Parse and verify a webhook request

## Parameters

### rawBody

`string`

The raw request body string

### signature

`string`

The signature from headers

### signatureKey

`string`

Your webhook signature key

### notificationUrl?

`string`

Optional notification URL for verification

## Returns

[`ParsedWebhookRequest`](../interfaces/ParsedWebhookRequest.md)

Parsed and verified webhook request

## Throws

Error if verification or parsing fails

## Example

```typescript
const { event } = parseAndVerifyWebhook(
  rawBody,
  signature,
  process.env.SQUARE_WEBHOOK_KEY!
);
```
