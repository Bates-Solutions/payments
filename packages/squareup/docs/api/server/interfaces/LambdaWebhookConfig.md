[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / LambdaWebhookConfig

# Interface: LambdaWebhookConfig

Defined in: [squareup/src/server/middleware/lambda.ts:70](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L70)

Configuration for Lambda webhook handling

## Properties

### corsHeaders?

> `optional` **corsHeaders?**: `Record`\<`string`, `string`\>

Defined in: [squareup/src/server/middleware/lambda.ts:82](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L82)

Custom CORS headers (merged with defaults)

***

### handlers

> **handlers**: [`LambdaWebhookHandlers`](../type-aliases/LambdaWebhookHandlers.md)

Defined in: [squareup/src/server/middleware/lambda.ts:74](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L74)

Event handlers by type

***

### logger?

> `optional` **logger?**: `false` \| [`WebhookLogger`](WebhookLogger.md)

Defined in: [squareup/src/server/middleware/lambda.ts:84](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L84)

Logger instance (defaults to console)

***

### notificationUrl

> **notificationUrl**: `string`

Defined in: [squareup/src/server/middleware/lambda.ts:80](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L80)

The exact notification URL registered on the webhook subscription.
Required: Square signs `notificationUrl + rawBody`, so without it no real
delivery verifies.

***

### onUnhandledEvent?

> `optional` **onUnhandledEvent?**: (`event`, `context`) => `void` \| `Promise`\<`void`\>

Defined in: [squareup/src/server/middleware/lambda.ts:86](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L86)

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

Defined in: [squareup/src/server/middleware/lambda.ts:72](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L72)

Square webhook signature key, or a list of keys during rotation
