[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookHandlers

# Type Alias: WebhookHandlers

> **WebhookHandlers** = `{ [K in WebhookEventType]?: WebhookHandler<Extract<Stripe.Event, { type: K }>> }`

Defined in: [server/types.ts:37](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/types.ts#L37)

Map of event types to their handlers. Each handler receives the event
narrowed to its specific type.

## Example

```typescript
const handlers: WebhookHandlers = {
  'payment_intent.succeeded': (event) => {
    // event.data.object is a Stripe.PaymentIntent here
    console.log(event.data.object.amount);
  },
};
```
