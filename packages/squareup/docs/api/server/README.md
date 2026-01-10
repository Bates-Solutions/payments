[**@bates-solutions/squareup API Reference v0.2.0**](../README.md)

***

[@bates-solutions/squareup API Reference](../README.md) / server

# server

## Interfaces

- [ExpressWebhookOptions](interfaces/ExpressWebhookOptions.md)
- [ParsedWebhookRequest](interfaces/ParsedWebhookRequest.md)
- [SquareWebhookRequest](interfaces/SquareWebhookRequest.md)
- [WebhookConfig](interfaces/WebhookConfig.md)
- [WebhookEvent](interfaces/WebhookEvent.md)
- [WebhookResponse](interfaces/WebhookResponse.md)
- [WebhookVerificationResult](interfaces/WebhookVerificationResult.md)

## Type Aliases

- [CatalogEventType](type-aliases/CatalogEventType.md)
- [CustomerEventType](type-aliases/CustomerEventType.md)
- [InventoryEventType](type-aliases/InventoryEventType.md)
- [InvoiceEventType](type-aliases/InvoiceEventType.md)
- [LaborEventType](type-aliases/LaborEventType.md)
- [LoyaltyEventType](type-aliases/LoyaltyEventType.md)
- [OrderEventType](type-aliases/OrderEventType.md)
- [PaymentEventType](type-aliases/PaymentEventType.md)
- [RefundEventType](type-aliases/RefundEventType.md)
- [SubscriptionEventType](type-aliases/SubscriptionEventType.md)
- [TeamEventType](type-aliases/TeamEventType.md)
- [WebhookEventType](type-aliases/WebhookEventType.md)
- [WebhookHandler](type-aliases/WebhookHandler.md)
- [WebhookHandlers](type-aliases/WebhookHandlers.md)

## Variables

- [rawBodyMiddleware](variables/rawBodyMiddleware.md)
- [SIGNATURE\_HEADER](variables/SIGNATURE_HEADER.md)

## Functions

- [createExpressWebhookHandler](functions/createExpressWebhookHandler.md)
- [createNextPagesWebhookHandler](functions/createNextPagesWebhookHandler.md)
- [createNextWebhookHandler](functions/createNextWebhookHandler.md)
- [createWebhookProcessor](functions/createWebhookProcessor.md)
- [parseAndVerifyWebhook](functions/parseAndVerifyWebhook.md)
- [parseNextWebhook](functions/parseNextWebhook.md)
- [parseWebhookEvent](functions/parseWebhookEvent.md)
- [processWebhookEvent](functions/processWebhookEvent.md)
- [verifySignature](functions/verifySignature.md)
