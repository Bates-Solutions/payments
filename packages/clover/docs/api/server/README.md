[**@bates-solutions/clover API Reference v0.0.0**](../README.md)

***

[@bates-solutions/clover API Reference](../README.md) / server

# server

## Interfaces

- [CloverWebhookRequest](interfaces/CloverWebhookRequest.md)
- [ExpressWebhookOptions](interfaces/ExpressWebhookOptions.md)
- [LambdaProxyEvent](interfaces/LambdaProxyEvent.md)
- [LambdaProxyResult](interfaces/LambdaProxyResult.md)
- [LambdaWebhookConfig](interfaces/LambdaWebhookConfig.md)
- [ParsedWebhookRequest](interfaces/ParsedWebhookRequest.md)
- [VerifyOptions](interfaces/VerifyOptions.md)
- [WebhookConfig](interfaces/WebhookConfig.md)
- [WebhookEvent](interfaces/WebhookEvent.md)
- [WebhookLogger](interfaces/WebhookLogger.md)
- [WebhookVerificationResult](interfaces/WebhookVerificationResult.md)

## Type Aliases

- [WebhookHandler](type-aliases/WebhookHandler.md)
- [WebhookHandlers](type-aliases/WebhookHandlers.md)

## Variables

- [SIGNATURE\_HEADER](variables/SIGNATURE_HEADER.md)

## Functions

- [createExpressWebhookHandler](functions/createExpressWebhookHandler.md)
- [createLambdaWebhookHandler](functions/createLambdaWebhookHandler.md)
- [createWebhookHandler](functions/createWebhookHandler.md)
- [createWebhookProcessor](functions/createWebhookProcessor.md)
- [getVerificationCode](functions/getVerificationCode.md)
- [parseAndVerifyWebhook](functions/parseAndVerifyWebhook.md)
- [parseWebhookEvent](functions/parseWebhookEvent.md)
- [processWebhookEvent](functions/processWebhookEvent.md)
- [verifySignature](functions/verifySignature.md)
