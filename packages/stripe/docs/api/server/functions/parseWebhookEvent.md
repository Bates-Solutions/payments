[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseWebhookEvent

# Function: parseWebhookEvent()

> **parseWebhookEvent**(`rawBody`): `Event`

Defined in: [server/webhook.ts:161](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/webhook.ts#L161)

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
