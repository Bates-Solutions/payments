[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / LambdaWebhookConfig

# Interface: LambdaWebhookConfig

Defined in: server/middleware/lambda.ts:74

Configuration for Lambda webhook handling.

## Extends

- [`VerifyOptions`](VerifyOptions.md)

## Properties

### corsHeaders?

> `optional` **corsHeaders?**: `Record`\<`string`, `string`\>

Defined in: server/middleware/lambda.ts:80

Custom CORS headers (merged with defaults)

***

### handlers

> **handlers**: [`LambdaWebhookHandlers`](../type-aliases/LambdaWebhookHandlers.md)

Defined in: server/middleware/lambda.ts:78

Event handlers by type

***

### logger?

> `optional` **logger?**: `false` \| [`WebhookLogger`](WebhookLogger.md)

Defined in: server/middleware/lambda.ts:82

Logger instance (defaults to console); pass `false` to disable

***

### onUnhandledEvent?

> `optional` **onUnhandledEvent?**: (`event`, `context`) => `void` \| `Promise`\<`void`\>

Defined in: server/middleware/lambda.ts:84

Callback for events with no registered handler

#### Parameters

##### event

`Event`

##### context

[`WebhookEventContext`](WebhookEventContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### signingSecret

> **signingSecret**: `string`

Defined in: server/middleware/lambda.ts:76

Stripe webhook signing secret (`whsec_…`)

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

[`VerifyOptions`](VerifyOptions.md).[`tolerance`](VerifyOptions.md#tolerance)
