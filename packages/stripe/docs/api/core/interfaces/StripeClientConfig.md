[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClientConfig

# Interface: StripeClientConfig

<<<<<<< HEAD
Defined in: [core/client.ts:15](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L15)
=======
Defined in: [core/client.ts:10](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L10)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Configuration options for the Stripe client

## Properties

### apiKey

> **apiKey**: `string`

<<<<<<< HEAD
Defined in: [core/client.ts:19](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L19)
=======
Defined in: [core/client.ts:14](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L14)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Stripe secret API key (e.g. `sk_test_…` or `sk_live_…`)

***

### apiVersion?

> `optional` **apiVersion?**: `string`

<<<<<<< HEAD
Defined in: [core/client.ts:25](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L25)
=======
Defined in: [core/client.ts:20](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L20)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Pin a specific Stripe API version. Omit to use the version configured on
your Stripe account.

***

### maxNetworkRetries?

> `optional` **maxNetworkRetries?**: `number`

<<<<<<< HEAD
Defined in: [core/client.ts:31](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/client.ts#L31)
=======
Defined in: [core/client.ts:26](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/client.ts#L26)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Number of times the Stripe SDK retries failed requests.

#### Default

```ts
1
```
