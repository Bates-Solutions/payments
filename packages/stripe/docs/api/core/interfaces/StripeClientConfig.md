[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeClientConfig

# Interface: StripeClientConfig

Defined in: [core/client.ts:37](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L37)

Configuration options for the Stripe client

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [core/client.ts:41](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L41)

Stripe secret API key (e.g. `sk_test_…` or `sk_live_…`)

***

### apiVersion?

> `optional` **apiVersion?**: `string`

Defined in: [core/client.ts:47](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L47)

Pin a specific Stripe API version. Omit to use the version configured on
your Stripe account.

***

### connectClientId?

> `optional` **connectClientId?**: `string`

Defined in: [core/client.ts:67](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L67)

Your platform's Connect client ID (`ca_…`). Used as the default by
`oauth.deauthorize`.

***

### maxNetworkRetries?

> `optional` **maxNetworkRetries?**: `number`

Defined in: [core/client.ts:53](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L53)

Number of times the Stripe SDK retries failed requests.

#### Default

```ts
1
```

***

### stripeAccount?

> `optional` **stripeAccount?**: `string`

Defined in: [core/client.ts:61](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/client.ts#L61)

Act as this connected account (`acct_…`) on every call: the SDK sends it
as the `Stripe-Account` header. Anything that isn't an `acct_…` ID throws
`StripeValidationError`. Usually you don't set this yourself; use
[StripeClient.forAccount](../classes/StripeClient.md#foraccount) on your platform client instead.
