[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / createLambdaWebhookHandler

# Function: createLambdaWebhookHandler()

> **createLambdaWebhookHandler**(`config`): (`proxyEvent`) => `Promise`\<[`LambdaProxyResult`](../interfaces/LambdaProxyResult.md)\>

Defined in: [server/middleware/lambda.ts:76](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/lambda.ts#L76)

Create an AWS Lambda handler for Clover webhooks.

Handles CORS preflight, the URL-verification handshake, signature
verification, parsing, and dispatch.

## Parameters

### config

[`LambdaWebhookConfig`](../interfaces/LambdaWebhookConfig.md)

## Returns

(`proxyEvent`) => `Promise`\<[`LambdaProxyResult`](../interfaces/LambdaProxyResult.md)\>
