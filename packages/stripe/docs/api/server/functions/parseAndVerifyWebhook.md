[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseAndVerifyWebhook

# Function: parseAndVerifyWebhook()

> **parseAndVerifyWebhook**(`rawBody`, `signature`, `signingSecret`, `options?`): `Promise`\<[`ParsedWebhookRequest`](../interfaces/ParsedWebhookRequest.md)\>

Defined in: [server/webhook.ts:185](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/server/webhook.ts#L185)

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
