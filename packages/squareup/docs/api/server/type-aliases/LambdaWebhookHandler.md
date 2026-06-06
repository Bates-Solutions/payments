[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / LambdaWebhookHandler

# Type Alias: LambdaWebhookHandler\<T\>

> **LambdaWebhookHandler**\<`T`\> = (`event`, `context`) => `void` \| `Promise`\<`void`\>

Defined in: [server/middleware/lambda.ts:42](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/middleware/lambda.ts#L42)

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
