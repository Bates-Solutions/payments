[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / ExpressWebhookOptions

# Interface: ExpressWebhookOptions

Defined in: [squareup/src/server/middleware/express.ts:68](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L68)

Options for the Express webhook middleware

## Extends

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### autoRespond?

> `optional` **autoRespond?**: `boolean`

Defined in: [squareup/src/server/middleware/express.ts:78](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L78)

Whether to send response automatically

#### Default

```ts
true
```

***

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: [squareup/src/server/types.ts:122](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L122)

Event handlers by type

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`handlers`](WebhookConfig.md#handlers)

***

### notificationUrl?

> `optional` **notificationUrl?**: `string`

Defined in: [squareup/src/server/types.ts:124](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L124)

URL where webhooks are received (for signature verification)

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`notificationUrl`](WebhookConfig.md#notificationurl)

***

### path?

> `optional` **path?**: `string`

Defined in: [squareup/src/server/middleware/express.ts:73](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L73)

Path to mount the webhook handler

#### Default

```ts
'/webhook'
```

***

### signatureKey

> **signatureKey**: [`WebhookSignatureKey`](../type-aliases/WebhookSignatureKey.md)

Defined in: [squareup/src/server/types.ts:120](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L120)

Square webhook signature key, or a list of keys during rotation

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`signatureKey`](WebhookConfig.md#signaturekey)

***

### throwOnInvalidSignature?

> `optional` **throwOnInvalidSignature?**: `boolean`

Defined in: [squareup/src/server/types.ts:132](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L132)

How `createWebhookProcessor` reports an invalid signature. When `true`
(default) it throws (surfaced as `{ success: false, error }`); when `false`
it returns `{ success: false, error }` without throwing. Either way an
invalid signature is **never dispatched to handlers**.

#### Default

```ts
true
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`throwOnInvalidSignature`](WebhookConfig.md#throwoninvalidsignature)
