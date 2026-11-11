[**@bates-solutions/stripe API Reference v1.0.3**](../README.md)

***

[@bates-solutions/stripe API Reference](../README.md) / core

# core

`@bates-solutions/stripe` — a TypeScript wrapper for the Stripe API.

The package's main entrypoint. Exports `createStripeClient` / `StripeClient`
(one service per Stripe domain — `customers`, `checkout`, `billingPortal`,
`subscriptions`, `prices`, `products`, `invoices`, `paymentLinks`, `paymentMethods`,
`setupIntents`, `payments`, `refunds`, `oauth`; `forAccount(id)` scopes a client
to a Connect account), the
normalized error hierarchy (`StripeError` + `parseStripeError`), and money /
idempotency utilities (`toMinor`, `fromMinor`, `formatMoney`,
`createIdempotencyKey`). Webhook helpers live in the
`@bates-solutions/stripe/server` entrypoint.

## Example

```ts
import { createStripeClient } from '@bates-solutions/stripe';

const stripe = createStripeClient({ apiKey: process.env.STRIPE_SECRET_KEY! });
const customer = await stripe.customers.create({ email: 'jane@example.com' });
```

## Classes

- [BillingPortalService](classes/BillingPortalService.md)
- [CheckoutService](classes/CheckoutService.md)
- [CustomersService](classes/CustomersService.md)
- [InvoicesService](classes/InvoicesService.md)
- [OAuthService](classes/OAuthService.md)
- [PaymentLinksService](classes/PaymentLinksService.md)
- [PaymentMethodsService](classes/PaymentMethodsService.md)
- [PaymentsService](classes/PaymentsService.md)
- [PricesService](classes/PricesService.md)
- [ProductsService](classes/ProductsService.md)
- [RefundsService](classes/RefundsService.md)
- [SetupIntentsService](classes/SetupIntentsService.md)
- [StripeApiError](classes/StripeApiError.md)
- [StripeAuthError](classes/StripeAuthError.md)
- [StripeClient](classes/StripeClient.md)
- [StripeError](classes/StripeError.md)
- [StripePaymentError](classes/StripePaymentError.md)
- [StripeValidationError](classes/StripeValidationError.md)
- [SubscriptionsService](classes/SubscriptionsService.md)

## Interfaces

- [AddInvoiceItemOptions](interfaces/AddInvoiceItemOptions.md)
- [BuildAuthorizeUrlOptions](interfaces/BuildAuthorizeUrlOptions.md)
- [CancelSubscriptionOptions](interfaces/CancelSubscriptionOptions.md)
- [CheckoutLineItem](interfaces/CheckoutLineItem.md)
- [ConnectedAccountGrant](interfaces/ConnectedAccountGrant.md)
- [CreateCheckoutSessionOptions](interfaces/CreateCheckoutSessionOptions.md)
- [CreateCustomerOptions](interfaces/CreateCustomerOptions.md)
- [CreateInvoiceOptions](interfaces/CreateInvoiceOptions.md)
- [CreatePaymentOptions](interfaces/CreatePaymentOptions.md)
- [CreatePortalSessionOptions](interfaces/CreatePortalSessionOptions.md)
- [CreatePriceOptions](interfaces/CreatePriceOptions.md)
- [CreateProductOptions](interfaces/CreateProductOptions.md)
- [CreateRefundOptions](interfaces/CreateRefundOptions.md)
- [CreateSetupIntentOptions](interfaces/CreateSetupIntentOptions.md)
- [CustomerAddress](interfaces/CustomerAddress.md)
- [DeauthorizeOptions](interfaces/DeauthorizeOptions.md)
- [ListCheckoutSessionsOptions](interfaces/ListCheckoutSessionsOptions.md)
- [ListCustomersOptions](interfaces/ListCustomersOptions.md)
- [ListInvoicesOptions](interfaces/ListInvoicesOptions.md)
- [ListLineItemsOptions](interfaces/ListLineItemsOptions.md)
- [ListPaymentMethodsOptions](interfaces/ListPaymentMethodsOptions.md)
- [ListPaymentsOptions](interfaces/ListPaymentsOptions.md)
- [ListPricesOptions](interfaces/ListPricesOptions.md)
- [ListProductsOptions](interfaces/ListProductsOptions.md)
- [ListRefundsOptions](interfaces/ListRefundsOptions.md)
- [ListSetupIntentsOptions](interfaces/ListSetupIntentsOptions.md)
- [ListSubscriptionsOptions](interfaces/ListSubscriptionsOptions.md)
- [Money](interfaces/Money.md)
- [MoneyInput](interfaces/MoneyInput.md)
- [NormalizedSubscription](interfaces/NormalizedSubscription.md)
- [NormalizedSubscriptionItem](interfaces/NormalizedSubscriptionItem.md)
- [PaginatedResponse](interfaces/PaginatedResponse.md)
- [PaginationOptions](interfaces/PaginationOptions.md)
- [PriceRecurring](interfaces/PriceRecurring.md)
- [ReplacePriceOptions](interfaces/ReplacePriceOptions.md)
- [ReplacePriceResult](interfaces/ReplacePriceResult.md)
- [StripeClientConfig](interfaces/StripeClientConfig.md)
- [TimeRange](interfaces/TimeRange.md)
- [UpdateCustomerOptions](interfaces/UpdateCustomerOptions.md)
- [UpdatePriceOptions](interfaces/UpdatePriceOptions.md)
- [UpdateProductOptions](interfaces/UpdateProductOptions.md)

## Type Aliases

- [BillingPortalSession](type-aliases/BillingPortalSession.md)
- [CheckoutSession](type-aliases/CheckoutSession.md)
- [ConnectOAuthScope](type-aliases/ConnectOAuthScope.md)
- [CurrencyCode](type-aliases/CurrencyCode.md)
- [Customer](type-aliases/Customer.md)
- [Invoice](type-aliases/Invoice.md)
- [InvoiceItem](type-aliases/InvoiceItem.md)
- [InvoiceLineItem](type-aliases/InvoiceLineItem.md)
- [LineItem](type-aliases/LineItem.md)
- [Payment](type-aliases/Payment.md)
- [PaymentLink](type-aliases/PaymentLink.md)
- [PaymentMethod](type-aliases/PaymentMethod.md)
- [Price](type-aliases/Price.md)
- [Product](type-aliases/Product.md)
- [Refund](type-aliases/Refund.md)
- [RefundReason](type-aliases/RefundReason.md)
- [SetupIntent](type-aliases/SetupIntent.md)
- [StripeEnvironment](type-aliases/StripeEnvironment.md)
- [StripeErrorCode](type-aliases/StripeErrorCode.md)
- [Subscription](type-aliases/Subscription.md)
- [SubscriptionStatus](type-aliases/SubscriptionStatus.md)

## Functions

- [buildAuthorizeUrl](functions/buildAuthorizeUrl.md)
- [createIdempotencyKey](functions/createIdempotencyKey.md)
- [createStripeClient](functions/createStripeClient.md)
- [formatMoney](functions/formatMoney.md)
- [fromMinor](functions/fromMinor.md)
- [fromUnixTime](functions/fromUnixTime.md)
- [normalizeSubscription](functions/normalizeSubscription.md)
- [parseStripeError](functions/parseStripeError.md)
- [resolveId](functions/resolveId.md)
- [toMinor](functions/toMinor.md)
- [toUnixTime](functions/toUnixTime.md)
