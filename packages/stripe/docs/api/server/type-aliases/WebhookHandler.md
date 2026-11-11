[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookHandler

# Type Alias: WebhookHandler\<E\>

> **WebhookHandler**\<`E`\> = (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [server/types.ts:19](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/types.ts#L19)

Handler for a webhook event of a specific type.

## Type Parameters

### E

`E` *extends* [`WebhookEvent`](WebhookEvent.md) = [`WebhookEvent`](WebhookEvent.md)

## Parameters

### event

`E`

## Returns

`void` \| `Promise`\<`void`\>
