[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / VerifyOptions

# Interface: VerifyOptions

Defined in: [server/types.ts:44](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/types.ts#L44)

Options controlling signature verification.

## Extended by

- [`WebhookConfig`](WebhookConfig.md)
- [`LambdaWebhookConfig`](LambdaWebhookConfig.md)

## Properties

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [server/types.ts:50](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/types.ts#L50)

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```
