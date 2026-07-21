[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClientConfig

# Interface: StripeClientConfig

Defined in: core/client.ts:10

Configuration options for the Stripe client

## Properties

### apiKey

> **apiKey**: `string`

Defined in: core/client.ts:14

Stripe secret API key (e.g. `sk_test_…` or `sk_live_…`)

***

### apiVersion?

> `optional` **apiVersion?**: `string`

Defined in: core/client.ts:20

Pin a specific Stripe API version. Omit to use the version configured on
your Stripe account.

***

### maxNetworkRetries?

> `optional` **maxNetworkRetries?**: `number`

Defined in: core/client.ts:26

Number of times the Stripe SDK retries failed requests.

#### Default

```ts
1
```
