[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookConfig

# Interface: WebhookConfig

Defined in: [server/types.ts:56](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L56)

Configuration for webhook handling.

## Extends

- [`VerifyOptions`](VerifyOptions.md)

## Extended by

- [`ExpressWebhookOptions`](ExpressWebhookOptions.md)

## Properties

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: [server/types.ts:60](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L60)

Event handlers by type

***

### signingSecret

> **signingSecret**: `string`

Defined in: [server/types.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L58)

Stripe webhook signing secret (`whsec_…`)

***

### throwOnInvalidSignature?

> `optional` **throwOnInvalidSignature?**: `boolean`

Defined in: [server/types.ts:65](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L65)

Whether to treat a signature verification failure as an error.

#### Default

```ts
true
```

***

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L50)

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```

#### Inherited from

[`VerifyOptions`](VerifyOptions.md).[`tolerance`](VerifyOptions.md#tolerance)
