[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / VerifyOptions

# Interface: VerifyOptions

Defined in: [server/types.ts:44](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/server/types.ts#L44)

Options controlling signature verification.

## Extended by

- [`WebhookConfig`](WebhookConfig.md)
- [`LambdaWebhookConfig`](LambdaWebhookConfig.md)

## Properties

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/server/types.ts#L50)

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```
