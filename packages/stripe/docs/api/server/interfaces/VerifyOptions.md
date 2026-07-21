[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / VerifyOptions

# Interface: VerifyOptions

<<<<<<< HEAD
Defined in: [server/types.ts:44](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L44)
=======
Defined in: [server/types.ts:44](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L44)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Options controlling signature verification.

## Extended by

- [`WebhookConfig`](WebhookConfig.md)
- [`LambdaWebhookConfig`](LambdaWebhookConfig.md)

## Properties

### tolerance?

> `optional` **tolerance?**: `number`

<<<<<<< HEAD
Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L50)
=======
Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L50)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```
