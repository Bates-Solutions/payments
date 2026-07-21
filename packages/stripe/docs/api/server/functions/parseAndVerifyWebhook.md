[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseAndVerifyWebhook

# Function: parseAndVerifyWebhook()

> **parseAndVerifyWebhook**(`rawBody`, `signature`, `signingSecret`, `options?`): `Promise`\<[`ParsedWebhookRequest`](../interfaces/ParsedWebhookRequest.md)\>

Defined in: [server/webhook.ts:188](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/webhook.ts#L188)

Verify and parse a webhook request.

## Parameters

### rawBody

`string`

The raw request body string

### signature

`string`

The `stripe-signature` header value

### signingSecret

`string`

Your webhook signing secret

### options?

[`VerifyOptions`](../interfaces/VerifyOptions.md)

Verification options

## Returns

`Promise`\<[`ParsedWebhookRequest`](../interfaces/ParsedWebhookRequest.md)\>

The parsed and verified webhook request

## Throws

Error if verification or parsing fails

## Example

```typescript
const { event } = parseAndVerifyWebhook(
  rawBody,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```
