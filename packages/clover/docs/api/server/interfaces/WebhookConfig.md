[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / WebhookConfig

# Interface: WebhookConfig

Defined in: server/types.ts:39

Configuration for webhook handling.

## Extends

- [`VerifyOptions`](VerifyOptions.md)

## Extended by

- [`ExpressWebhookOptions`](ExpressWebhookOptions.md)
- [`LambdaWebhookConfig`](LambdaWebhookConfig.md)

## Properties

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: server/types.ts:43

Event handlers by type

***

### signingSecret

> **signingSecret**: `string`

Defined in: server/types.ts:41

Clover webhook signing secret

***

### throwOnInvalidSignature?

> `optional` **throwOnInvalidSignature?**: `boolean`

Defined in: server/types.ts:56

Whether a signature verification failure throws (vs returning an error
result) in [createWebhookProcessor](../functions/createWebhookProcessor.md). Either way an invalid signature
is never dispatched to handlers.

#### Default

```ts
true
```

***

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: server/types.ts:33

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```

#### Inherited from

[`VerifyOptions`](VerifyOptions.md).[`tolerance`](VerifyOptions.md#tolerance)

***

### verificationCode?

> `optional` **verificationCode?**: `string`

Defined in: server/types.ts:49

The verification code Clover expects echoed during the initial webhook
URL handshake. When set, the framework handlers answer the handshake
automatically.
