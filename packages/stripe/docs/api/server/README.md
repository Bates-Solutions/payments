[**@bates-solutions/stripe API Reference v2.0.0**](../README.md)

***

[@bates-solutions/stripe API Reference](../README.md) / server

# server

`@bates-solutions/stripe/server` — webhook helpers for the Stripe wrapper.

Server utilities for handling Stripe webhooks: signature verification plus a
typed handler-map dispatch, with adapters for Express, Next.js, AWS Lambda,
and a framework-neutral Web/edge handler.

## Example

```typescript
// Next.js App Router
import { createNextWebhookHandler } from '@bates-solutions/stripe/server';

export const POST = createNextWebhookHandler({
  signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  handlers: {
    'payment_intent.succeeded': async (event) => {
      console.log('Paid:', event.data.object.id);
    },
  },
});
```

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

- [CheckoutSessionCompletedEvent](type-aliases/CheckoutSessionCompletedEvent.md)
- [InvoicePaidEvent](type-aliases/InvoicePaidEvent.md)
- [InvoicePaymentFailedEvent](type-aliases/InvoicePaymentFailedEvent.md)
- [LambdaWebhookHandler](type-aliases/LambdaWebhookHandler.md)
- [LambdaWebhookHandlers](type-aliases/LambdaWebhookHandlers.md)
- [SubscriptionCreatedEvent](type-aliases/SubscriptionCreatedEvent.md)
- [SubscriptionDeletedEvent](type-aliases/SubscriptionDeletedEvent.md)
- [SubscriptionUpdatedEvent](type-aliases/SubscriptionUpdatedEvent.md)
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
- [createWebhookHandler](functions/createWebhookHandler.md)
- [createWebhookProcessor](functions/createWebhookProcessor.md)
- [getAccountId](functions/getAccountId.md)
- [getChargeId](functions/getChargeId.md)
- [getCustomerId](functions/getCustomerId.md)
- [getInvoiceId](functions/getInvoiceId.md)
- [getPaymentIntentId](functions/getPaymentIntentId.md)
- [getSubscriptionId](functions/getSubscriptionId.md)
- [parseAndVerifyWebhook](functions/parseAndVerifyWebhook.md)
- [parseNextWebhook](functions/parseNextWebhook.md)
- [parseWebhookEvent](functions/parseWebhookEvent.md)
- [processWebhookEvent](functions/processWebhookEvent.md)
- [verifySignature](functions/verifySignature.md)

## References

### resolveId

Re-exports [resolveId](../core/functions/resolveId.md)
