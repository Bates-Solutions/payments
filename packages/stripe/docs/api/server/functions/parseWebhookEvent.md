[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseWebhookEvent

# Function: parseWebhookEvent()

> **parseWebhookEvent**(`rawBody`): `Event`

Defined in: [server/webhook.ts:161](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/webhook.ts#L161)

Parse a webhook request body into a typed event.

## Parameters

### rawBody

`string`

The raw request body string

## Returns

`Event`

The parsed webhook event

## Throws

Error if the payload is not valid JSON

## Example

```typescript
const event = parseWebhookEvent(rawBody);
console.log(event.type); // 'payment_intent.succeeded'
```
