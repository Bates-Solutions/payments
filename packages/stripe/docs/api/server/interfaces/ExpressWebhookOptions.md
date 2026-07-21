[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / ExpressWebhookOptions

# Interface: ExpressWebhookOptions

Defined in: server/middleware/express.ts:18

Options for the Express webhook middleware.

## Extends

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### autoRespond?

> `optional` **autoRespond?**: `boolean`

Defined in: server/middleware/express.ts:23

Whether to send the response automatically.

#### Default

```ts
true
```

***

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: server/types.ts:60

Event handlers by type

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`handlers`](WebhookConfig.md#handlers)

***

### signingSecret

> **signingSecret**: `string`

Defined in: server/types.ts:58

Stripe webhook signing secret (`whsec_…`)

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`signingSecret`](WebhookConfig.md#signingsecret)

***

### throwOnInvalidSignature?

> `optional` **throwOnInvalidSignature?**: `boolean`

Defined in: server/types.ts:65

Whether to treat a signature verification failure as an error.

#### Default

```ts
true
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`throwOnInvalidSignature`](WebhookConfig.md#throwoninvalidsignature)

***

### tolerance?

> `optional` **tolerance?**: `number`

Defined in: server/types.ts:50

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`tolerance`](WebhookConfig.md#tolerance)
