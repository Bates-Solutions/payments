[**@bates-solutions/clover API Reference v1.1.0**](../README.md)

***

[@bates-solutions/clover API Reference](../README.md) / core

# core

`@bates-solutions/clover` — a TypeScript wrapper for the Clover Ecommerce and
Platform APIs.

The package's main entrypoint. Exports `createCloverClient` / `CloverClient`
(one service per Clover domain — `payments`, `refunds`, `customers`, `inventory`), the
normalized error hierarchy (`CloverError` + `parseCloverError`), and money /
idempotency utilities, plus the v2 OAuth helpers (`buildAuthorizeUrl`,
`createCloverOAuthClient`) for connecting a merchant. It ships no vendor SDK — it talks to Clover over a
small fetch-based REST client that targets both Clover hosts. Webhook helpers
live in the `@bates-solutions/clover/server` entrypoint.

## Example

```ts
import { createCloverClient } from '@bates-solutions/clover';

const clover = createCloverClient({ apiToken: process.env.CLOVER_API_TOKEN! });
const charge = await clover.payments.create({ amount: 1000, source: 'clv_tok' });
```

## Classes

- [CloverApiError](classes/CloverApiError.md)
- [CloverAuthError](classes/CloverAuthError.md)
- [CloverClient](classes/CloverClient.md)
- [CloverError](classes/CloverError.md)
- [CloverHttp](classes/CloverHttp.md)
- [CloverOAuthClient](classes/CloverOAuthClient.md)
- [CloverPaymentError](classes/CloverPaymentError.md)
- [CloverValidationError](classes/CloverValidationError.md)
- [CustomersService](classes/CustomersService.md)
- [InventoryService](classes/InventoryService.md)
- [OrdersService](classes/OrdersService.md)
- [PaymentsService](classes/PaymentsService.md)
- [RefundsService](classes/RefundsService.md)

## Interfaces

- [BuildAuthorizeUrlOptions](interfaces/BuildAuthorizeUrlOptions.md)
- [CaptureChargeOptions](interfaces/CaptureChargeOptions.md)
- [Charge](interfaces/Charge.md)
- [CloverClientConfig](interfaces/CloverClientConfig.md)
- [CloverHttpConfig](interfaces/CloverHttpConfig.md)
- [CloverOAuthClientConfig](interfaces/CloverOAuthClientConfig.md)
- [CreateChargeOptions](interfaces/CreateChargeOptions.md)
- [CreateCustomerOptions](interfaces/CreateCustomerOptions.md)
- [CreateItemOptions](interfaces/CreateItemOptions.md)
- [CreateRefundOptions](interfaces/CreateRefundOptions.md)
- [Customer](interfaces/Customer.md)
- [FindItemsByCodeOptions](interfaces/FindItemsByCodeOptions.md)
- [GetItemOptions](interfaces/GetItemOptions.md)
- [GetOrderOptions](interfaces/GetOrderOptions.md)
- [Item](interfaces/Item.md)
- [ItemFields](interfaces/ItemFields.md)
- [ItemStock](interfaces/ItemStock.md)
- [LineItem](interfaces/LineItem.md)
- [ListItemsOptions](interfaces/ListItemsOptions.md)
- [ListOrdersOptions](interfaces/ListOrdersOptions.md)
- [Money](interfaces/Money.md)
- [OAuthTokens](interfaces/OAuthTokens.md)
- [Order](interfaces/Order.md)
- [PaginatedResponse](interfaces/PaginatedResponse.md)
- [PaginationOptions](interfaces/PaginationOptions.md)
- [Refund](interfaces/Refund.md)
- [RequestOptions](interfaces/RequestOptions.md)
- [UpdateItemOptions](interfaces/UpdateItemOptions.md)
- [UpdateItemStockOptions](interfaces/UpdateItemStockOptions.md)

## Type Aliases

- [CloverEnvironment](type-aliases/CloverEnvironment.md)
- [CloverErrorCode](type-aliases/CloverErrorCode.md)
- [CloverHost](type-aliases/CloverHost.md)
- [CurrencyCode](type-aliases/CurrencyCode.md)
- [ItemExpand](type-aliases/ItemExpand.md)
- [ItemPriceType](type-aliases/ItemPriceType.md)
- [OrderExpand](type-aliases/OrderExpand.md)
- [OrderPaymentState](type-aliases/OrderPaymentState.md)
- [UpdateCustomerOptions](type-aliases/UpdateCustomerOptions.md)

## Functions

- [buildAuthorizeUrl](functions/buildAuthorizeUrl.md)
- [createCloverClient](functions/createCloverClient.md)
- [createCloverOAuthClient](functions/createCloverOAuthClient.md)
- [createIdempotencyKey](functions/createIdempotencyKey.md)
- [formatMoney](functions/formatMoney.md)
- [fromCents](functions/fromCents.md)
- [parseCloverError](functions/parseCloverError.md)
- [toCents](functions/toCents.md)
