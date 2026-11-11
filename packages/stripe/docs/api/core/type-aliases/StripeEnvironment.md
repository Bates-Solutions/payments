[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeEnvironment

# Type Alias: StripeEnvironment

> **StripeEnvironment** = `"test"` \| `"live"`

Defined in: [core/types/index.ts:7](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L7)

Stripe environment, derived from the API key prefix.

Stripe has no separate sandbox host — a `sk_test_…` key operates in test
mode and a `sk_live_…` key operates in live mode.
