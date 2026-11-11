[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / ExpressWebhookOptions

# Interface: ExpressWebhookOptions

Defined in: [server/middleware/express.ts:22](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/express.ts#L22)

Options for the Express webhook middleware.

## Extends

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### autoRespond?

> `optional` **autoRespond?**: `boolean`

Defined in: [server/middleware/express.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/express.ts#L27)

Whether to send the response automatically.

#### Default

```ts
true
```

***

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: [server/types.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/types.ts#L43)

Event handlers by type

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`handlers`](WebhookConfig.md#handlers)

***

### signingSecret

> **signingSecret**: `string`

Defined in: [server/types.ts:41](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/types.ts#L41)

Clover webhook signing secret

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`signingSecret`](WebhookConfig.md#signingsecret)

***

### throwOnInvalidSignature?

> `optional` **throwOnInvalidSignature?**: `boolean`

Defined in: [server/types.ts:56](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/types.ts#L56)

Whether a signature verification failure throws (vs returning an error
result) in [createWebhookProcessor](../functions/createWebhookProcessor.md). Either way an invalid signature
is never dispatched to handlers.

#### Default

```ts
true
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`throwOnInvalidSignature`](WebhookConfig.md#throwoninvalidsignature)

***

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: [server/types.ts:33](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/types.ts#L33)

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`tolerance`](WebhookConfig.md#tolerance)

***

### verificationCode?

> `optional` **verificationCode?**: `string`

Defined in: [server/types.ts:49](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/types.ts#L49)

The verification code Clover expects echoed during the initial webhook
URL handshake. When set, the framework handlers answer the handshake
automatically.

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`verificationCode`](WebhookConfig.md#verificationcode)
