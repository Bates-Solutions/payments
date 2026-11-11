[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CancelSubscriptionOptions

# Interface: CancelSubscriptionOptions

Defined in: [core/services/subscriptions.service.ts:99](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/subscriptions.service.ts#L99)

Options for cancelling a subscription

## Properties

### atPeriodEnd?

> `optional` **atPeriodEnd?**: `boolean`

Defined in: [core/services/subscriptions.service.ts:104](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/subscriptions.service.ts#L104)

Cancel at the end of the current period instead of immediately.

#### Default

```ts
false
```
