[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / StripeEnvironment

# Type Alias: StripeEnvironment

> **StripeEnvironment** = `"test"` \| `"live"`

Defined in: [core/types/index.ts:7](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L7)

Stripe environment, derived from the API key prefix.

Stripe has no separate sandbox host — a `sk_test_…` key operates in test
mode and a `sk_live_…` key operates in live mode.
