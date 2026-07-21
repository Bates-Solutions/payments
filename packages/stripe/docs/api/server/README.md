[**@bates-solutions/stripe API Reference v0.0.0**](../README.md)

***

[@bates-solutions/stripe API Reference](../README.md) / server

# server

## Interfaces

- [ExpressWebhookOptions](interfaces/ExpressWebhookOptions.md)
- [LambdaProxyEvent](interfaces/LambdaProxyEvent.md)
- [LambdaProxyResult](interfaces/LambdaProxyResult.md)
- [LambdaWebhookConfig](interfaces/LambdaWebhookConfig.md)
- [ParsedWebhookRequest](interfaces/ParsedWebhookRequest.md)
- [StripeWebhookRequest](interfaces/StripeWebhookRequest.md)
- [VerifyOptions](interfaces/VerifyOptions.md)
- [WebhookConfig](interfaces/WebhookConfig.md)
- [WebhookEventContext](interfaces/WebhookEventContext.md)
- [WebhookLogger](interfaces/WebhookLogger.md)
- [WebhookResponse](interfaces/WebhookResponse.md)
- [WebhookVerificationResult](interfaces/WebhookVerificationResult.md)

## Type Aliases

- [LambdaWebhookHandler](type-aliases/LambdaWebhookHandler.md)
- [LambdaWebhookHandlers](type-aliases/LambdaWebhookHandlers.md)
- [WebhookEvent](type-aliases/WebhookEvent.md)
- [WebhookEventType](type-aliases/WebhookEventType.md)
- [WebhookHandler](type-aliases/WebhookHandler.md)
- [WebhookHandlers](type-aliases/WebhookHandlers.md)

## Variables

- [rawBodyMiddleware](variables/rawBodyMiddleware.md)
- [SIGNATURE\_HEADER](variables/SIGNATURE_HEADER.md)

## Functions

- [createExpressWebhookHandler](functions/createExpressWebhookHandler.md)
- [createLambdaWebhookHandler](functions/createLambdaWebhookHandler.md)
- [createNextPagesWebhookHandler](functions/createNextPagesWebhookHandler.md)
- [createNextWebhookHandler](functions/createNextWebhookHandler.md)
- [createWebhookProcessor](functions/createWebhookProcessor.md)
- [getChargeId](functions/getChargeId.md)
- [getCustomerId](functions/getCustomerId.md)
- [getPaymentIntentId](functions/getPaymentIntentId.md)
- [parseAndVerifyWebhook](functions/parseAndVerifyWebhook.md)
- [parseNextWebhook](functions/parseNextWebhook.md)
- [parseWebhookEvent](functions/parseWebhookEvent.md)
- [processWebhookEvent](functions/processWebhookEvent.md)
- [verifySignature](functions/verifySignature.md)
