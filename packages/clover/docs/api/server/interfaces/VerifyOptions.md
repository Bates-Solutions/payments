[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / VerifyOptions

# Interface: VerifyOptions

Defined in: [server/types.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/types.ts#L27)

Options controlling signature verification.

## Extended by

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [server/types.ts:33](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/types.ts#L33)

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```
