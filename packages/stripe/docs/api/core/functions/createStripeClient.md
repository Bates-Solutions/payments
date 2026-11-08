[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / createStripeClient

# Function: createStripeClient()

> **createStripeClient**(`config`): [`StripeClient`](../classes/StripeClient.md)

Defined in: [core/client.ts:124](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/core/client.ts#L124)

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
