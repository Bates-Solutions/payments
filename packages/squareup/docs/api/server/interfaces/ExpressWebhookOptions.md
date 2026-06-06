[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / ExpressWebhookOptions

# Interface: ExpressWebhookOptions

Defined in: [server/middleware/express.ts:23](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/middleware/express.ts#L23)

Options for the Express webhook middleware

## Extends

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### autoRespond?

> `optional` **autoRespond?**: `boolean`

Defined in: [server/middleware/express.ts:33](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/middleware/express.ts#L33)

Whether to send response automatically

#### Default

```ts
true
```

***

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: [server/types.ts:115](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/types.ts#L115)

Event handlers by type

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`handlers`](WebhookConfig.md#handlers)

***

### notificationUrl?

> `optional` **notificationUrl?**: `string`

Defined in: [server/types.ts:117](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/types.ts#L117)

URL where webhooks are received (for signature verification)

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`notificationUrl`](WebhookConfig.md#notificationurl)

***

### path?

> `optional` **path?**: `string`

Defined in: [server/middleware/express.ts:28](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/middleware/express.ts#L28)

Path to mount the webhook handler

#### Default

```ts
'/webhook'
```

***

### signatureKey

> **signatureKey**: `string`

Defined in: [server/types.ts:113](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/types.ts#L113)

Square webhook signature key

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`signatureKey`](WebhookConfig.md#signaturekey)

***

### throwOnInvalidSignature?

> `optional` **throwOnInvalidSignature?**: `boolean`

Defined in: [server/types.ts:122](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/types.ts#L122)

Whether to throw on signature verification failure

#### Default

```ts
true
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`throwOnInvalidSignature`](WebhookConfig.md#throwoninvalidsignature)
