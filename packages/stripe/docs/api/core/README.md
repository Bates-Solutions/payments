[**@bates-solutions/stripe API Reference v0.0.0**](../README.md)

***

[@bates-solutions/stripe API Reference](../README.md) / core

# core

## Classes

- [BillingPortalService](classes/BillingPortalService.md)
- [CheckoutService](classes/CheckoutService.md)
- [CustomersService](classes/CustomersService.md)
- [PaymentsService](classes/PaymentsService.md)
- [PricesService](classes/PricesService.md)
- [ProductsService](classes/ProductsService.md)
- [RefundsService](classes/RefundsService.md)
- [StripeApiError](classes/StripeApiError.md)
- [StripeAuthError](classes/StripeAuthError.md)
- [StripeClient](classes/StripeClient.md)
- [StripeError](classes/StripeError.md)
- [StripePaymentError](classes/StripePaymentError.md)
- [StripeValidationError](classes/StripeValidationError.md)
- [SubscriptionsService](classes/SubscriptionsService.md)

## Interfaces

- [CancelSubscriptionOptions](interfaces/CancelSubscriptionOptions.md)
- [CheckoutLineItem](interfaces/CheckoutLineItem.md)
- [CreateCheckoutSessionOptions](interfaces/CreateCheckoutSessionOptions.md)
- [CreateCustomerOptions](interfaces/CreateCustomerOptions.md)
- [CreatePaymentOptions](interfaces/CreatePaymentOptions.md)
- [CreatePortalSessionOptions](interfaces/CreatePortalSessionOptions.md)
- [CreateRefundOptions](interfaces/CreateRefundOptions.md)
- [CustomerAddress](interfaces/CustomerAddress.md)
- [ListCheckoutSessionsOptions](interfaces/ListCheckoutSessionsOptions.md)
- [ListCustomersOptions](interfaces/ListCustomersOptions.md)
- [ListPaymentsOptions](interfaces/ListPaymentsOptions.md)
- [ListPricesOptions](interfaces/ListPricesOptions.md)
- [ListProductsOptions](interfaces/ListProductsOptions.md)
- [ListRefundsOptions](interfaces/ListRefundsOptions.md)
- [ListSubscriptionsOptions](interfaces/ListSubscriptionsOptions.md)
- [Money](interfaces/Money.md)
- [MoneyInput](interfaces/MoneyInput.md)
- [NormalizedSubscription](interfaces/NormalizedSubscription.md)
- [NormalizedSubscriptionItem](interfaces/NormalizedSubscriptionItem.md)
- [PaginatedResponse](interfaces/PaginatedResponse.md)
- [PaginationOptions](interfaces/PaginationOptions.md)
- [StripeClientConfig](interfaces/StripeClientConfig.md)
- [UpdateCustomerOptions](interfaces/UpdateCustomerOptions.md)

## Type Aliases

- [BillingPortalSession](type-aliases/BillingPortalSession.md)
- [CheckoutSession](type-aliases/CheckoutSession.md)
- [CurrencyCode](type-aliases/CurrencyCode.md)
- [Customer](type-aliases/Customer.md)
- [Payment](type-aliases/Payment.md)
- [Price](type-aliases/Price.md)
- [Product](type-aliases/Product.md)
- [Refund](type-aliases/Refund.md)
- [RefundReason](type-aliases/RefundReason.md)
- [StripeEnvironment](type-aliases/StripeEnvironment.md)
- [StripeErrorCode](type-aliases/StripeErrorCode.md)
- [Subscription](type-aliases/Subscription.md)
- [SubscriptionStatus](type-aliases/SubscriptionStatus.md)

## Functions

- [createIdempotencyKey](functions/createIdempotencyKey.md)
- [createStripeClient](functions/createStripeClient.md)
- [formatMoney](functions/formatMoney.md)
- [fromMinor](functions/fromMinor.md)
- [fromUnixTime](functions/fromUnixTime.md)
- [normalizeSubscription](functions/normalizeSubscription.md)
- [parseStripeError](functions/parseStripeError.md)
- [resolveId](functions/resolveId.md)
- [toMinor](functions/toMinor.md)
