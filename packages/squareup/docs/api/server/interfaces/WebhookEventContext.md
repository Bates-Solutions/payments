[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / WebhookEventContext

# Interface: WebhookEventContext

Defined in: [squareup/src/server/middleware/lambda.ts:59](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L59)

Context passed to Lambda webhook handlers with auto-extracted entity IDs

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [squareup/src/server/middleware/lambda.ts:62](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L62)

***

### orderId?

> `optional` **orderId?**: `string`

Defined in: [squareup/src/server/middleware/lambda.ts:61](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L61)

***

### paymentId?

> `optional` **paymentId?**: `string`

Defined in: [squareup/src/server/middleware/lambda.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L60)
