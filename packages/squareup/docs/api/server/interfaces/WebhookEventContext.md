[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / WebhookEventContext

# Interface: WebhookEventContext

Defined in: [server/middleware/lambda.ts:33](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/server/middleware/lambda.ts#L33)

Context passed to Lambda webhook handlers with auto-extracted entity IDs

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [server/middleware/lambda.ts:36](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/server/middleware/lambda.ts#L36)

***

### orderId?

> `optional` **orderId?**: `string`

Defined in: [server/middleware/lambda.ts:35](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/server/middleware/lambda.ts#L35)

***

### paymentId?

> `optional` **paymentId?**: `string`

Defined in: [server/middleware/lambda.ts:34](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/server/middleware/lambda.ts#L34)
