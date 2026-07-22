[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / VerifyOptions

# Interface: VerifyOptions

Defined in: server/types.ts:27

Options controlling signature verification.

## Extended by

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: server/types.ts:33

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```
