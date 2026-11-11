[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / createStripeClient

# Function: createStripeClient()

> **createStripeClient**(`config`): [`StripeClient`](../classes/StripeClient.md)

Defined in: [core/client.ts:222](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L222)

Create a new Stripe client instance.

## Parameters

### config

[`StripeClientConfig`](../interfaces/StripeClientConfig.md)

Client configuration

## Returns

[`StripeClient`](../classes/StripeClient.md)

Configured Stripe client

## Example

```typescript
const stripe = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
});
```
