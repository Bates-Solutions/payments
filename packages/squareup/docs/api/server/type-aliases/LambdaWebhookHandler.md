[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / LambdaWebhookHandler

# Type Alias: LambdaWebhookHandler\<T\>

> **LambdaWebhookHandler**\<`T`\> = (`event`, `context`) => `void` \| `Promise`\<`void`\>

Defined in: [server/middleware/lambda.ts:42](https://github.com/mbates/squareup/blob/9247d66f2d6844e833a2dc69bc01a9537b493e7a/src/server/middleware/lambda.ts#L42)

Handler function for Lambda webhook events

## Type Parameters

### T

`T` = `unknown`

## Parameters

### event

[`WebhookEvent`](../interfaces/WebhookEvent.md)\<`T`\>

### context

[`WebhookEventContext`](../interfaces/WebhookEventContext.md)

## Returns

`void` \| `Promise`\<`void`\>
