[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / parseWebhookEvent

# Function: parseWebhookEvent()

> **parseWebhookEvent**(`rawBody`): `Event`

Defined in: [server/webhook.ts:158](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/server/webhook.ts#L158)

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
