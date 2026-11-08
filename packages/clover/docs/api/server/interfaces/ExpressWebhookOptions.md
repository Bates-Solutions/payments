[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / ExpressWebhookOptions

# Interface: ExpressWebhookOptions

Defined in: server/middleware/express.ts:22

Options for the Express webhook middleware.

## Extends

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### autoRespond?

> `optional` **autoRespond?**: `boolean`

Defined in: server/middleware/express.ts:27

Whether to send the response automatically.

#### Default

```ts
true
```

***

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: server/types.ts:43

Event handlers by type

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`handlers`](WebhookConfig.md#handlers)

***

### signingSecret

> **signingSecret**: `string`

Defined in: server/types.ts:41

Clover webhook signing secret

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`signingSecret`](WebhookConfig.md#signingsecret)

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

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`throwOnInvalidSignature`](WebhookConfig.md#throwoninvalidsignature)

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

[`WebhookConfig`](WebhookConfig.md).[`tolerance`](WebhookConfig.md#tolerance)

***

### verificationCode?

> `optional` **verificationCode?**: `string`

Defined in: server/types.ts:49

The verification code Clover expects echoed during the initial webhook
URL handshake. When set, the framework handlers answer the handshake
automatically.

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`verificationCode`](WebhookConfig.md#verificationcode)
