[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / WebhookConfig

# Interface: WebhookConfig

Defined in: [squareup/src/server/types.ts:118](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L118)

Configuration for webhook handling

## Extended by

- [`ExpressWebhookOptions`](ExpressWebhookOptions.md)

## Properties

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

Defined in: [squareup/src/server/types.ts:122](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L122)

Event handlers by type

***

### notificationUrl?

> `optional` **notificationUrl?**: `string`

Defined in: [squareup/src/server/types.ts:124](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L124)

URL where webhooks are received (for signature verification)

***

### signatureKey

> **signatureKey**: [`WebhookSignatureKey`](../type-aliases/WebhookSignatureKey.md)

Defined in: [squareup/src/server/types.ts:120](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L120)

Square webhook signature key, or a list of keys during rotation

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
