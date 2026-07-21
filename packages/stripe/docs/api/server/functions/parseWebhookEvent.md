[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseWebhookEvent

# Function: parseWebhookEvent()

> **parseWebhookEvent**(`rawBody`): `Event`

<<<<<<< HEAD
Defined in: [server/webhook.ts:161](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/webhook.ts#L161)
=======
Defined in: [server/webhook.ts:158](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/webhook.ts#L158)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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
