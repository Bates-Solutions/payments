[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / LambdaWebhookConfig

# Interface: LambdaWebhookConfig

Defined in: [squareup/src/server/middleware/lambda.ts:96](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L96)

Configuration for Lambda webhook handling

## Properties

### corsHeaders?

> `optional` **corsHeaders?**: `Record`\<`string`, `string`\>

Defined in: [squareup/src/server/middleware/lambda.ts:108](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L108)

Custom CORS headers (merged with defaults)

***

### handlers

> **handlers**: [`LambdaWebhookHandlers`](../type-aliases/LambdaWebhookHandlers.md)

Defined in: [squareup/src/server/middleware/lambda.ts:100](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L100)

Event handlers by type

***

### logger?

> `optional` **logger?**: `false` \| [`WebhookLogger`](WebhookLogger.md)

Defined in: [squareup/src/server/middleware/lambda.ts:110](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L110)

Logger instance (defaults to console)

***

### notificationUrl

> **notificationUrl**: `string`

Defined in: [squareup/src/server/middleware/lambda.ts:106](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L106)

The exact notification URL registered on the webhook subscription.
Required: Square signs `notificationUrl + rawBody`, so without it no real
delivery verifies.

***

### onUnhandledEvent?

> `optional` **onUnhandledEvent?**: (`event`, `context`) => `void` \| `Promise`\<`void`\>

Defined in: [squareup/src/server/middleware/lambda.ts:112](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L112)

Callback for events with no registered handler

#### Parameters

##### event

[`WebhookEvent`](WebhookEvent.md)

##### context

[`WebhookEventContext`](WebhookEventContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### signatureKey

> **signatureKey**: [`WebhookSignatureKey`](../type-aliases/WebhookSignatureKey.md)

Defined in: [squareup/src/server/middleware/lambda.ts:98](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L98)

Square webhook signature key, or a list of keys during rotation
