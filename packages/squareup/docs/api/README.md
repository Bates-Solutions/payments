**@bates-solutions/squareup API Reference v0.2.0**

***

# @bates-solutions/squareup API Reference v0.2.0

> This documentation is auto-generated from source code using [TypeDoc](https://typedoc.org/). For a quick overview of all exports, see the [API Quick Reference](../api-reference.md).

## Modules

### [Core Module](core/README.md)

Backend API client and services for server-side Square integration.

| Export | Type | Description |
| ------ | ---- | ----------- |
| [`createSquareClient`](core/functions/createSquareClient.md) | Function | Factory for creating Square API client |
| [`PaymentsService`](core/classes/PaymentsService.md) | Class | Payment processing operations |
| [`OrdersService`](core/classes/OrdersService.md) | Class | Order management with fluent builder |
| [`CustomersService`](core/classes/CustomersService.md) | Class | Customer CRUD and search |
| [`CatalogService`](core/classes/CatalogService.md) | Class | Product catalog operations |
| [`InventoryService`](core/classes/InventoryService.md) | Class | Stock tracking and adjustments |
| [`SubscriptionsService`](core/classes/SubscriptionsService.md) | Class | Recurring billing management |
| [`InvoicesService`](core/classes/InvoicesService.md) | Class | Invoice generation and sending |
| [`LoyaltyService`](core/classes/LoyaltyService.md) | Class | Loyalty program management |

### [React Module](react/README.md)

React hooks and components for client-side payment integration.

| Export | Type | Description |
| ------ | ---- | ----------- |
| [`SquareProvider`](react/functions/SquareProvider.md) | Component | Context provider for SDK initialization |
| [`useSquare`](react/functions/useSquare.md) | Hook | Access Square context |
| [`useSquarePayment`](react/functions/useSquarePayment.md) | Hook | Card tokenization |
| [`usePayments`](react/functions/usePayments.md) | Hook | Payments API operations |
| [`useOrders`](react/functions/useOrders.md) | Hook | Orders API operations |
| [`useCustomers`](react/functions/useCustomers.md) | Hook | Customers API operations |
| [`useCatalog`](react/functions/useCatalog.md) | Hook | Catalog API operations |
| [`CardInput`](react/variables/CardInput.md) | Component | Pre-built card input |
| [`PaymentButton`](react/functions/PaymentButton.md) | Component | Google Pay / Apple Pay button |

### [Angular Module](angular/README.md)

Angular services and directives with RxJS Observables.

| Export | Type | Description |
| ------ | ---- | ----------- |
| [`SquareModule`](angular/classes/SquareModule.md) | NgModule | Module with `forRoot()` configuration |
| [`SquareSdkService`](angular/classes/SquareSdkService.md) | Service | SDK loading service |
| [`SquarePaymentsService`](angular/classes/SquarePaymentsService.md) | Service | Payment operations |
| [`SquareOrdersService`](angular/classes/SquareOrdersService.md) | Service | Order operations |
| [`SquareCustomersService`](angular/classes/SquareCustomersService.md) | Service | Customer operations |
| [`SquareCatalogService`](angular/classes/SquareCatalogService.md) | Service | Catalog operations |
| [`SquareCardDirective`](angular/classes/SquareCardDirective.md) | Directive | Card input directive |
| [`PaymentButtonComponent`](angular/classes/PaymentButtonComponent.md) | Component | Digital wallet component |

### [Server Module](server/README.md)

Webhook verification and middleware for Express and Next.js.

| Export | Type | Description |
| ------ | ---- | ----------- |
| [`verifySignature`](server/functions/verifySignature.md) | Function | HMAC-SHA256 signature verification |
| [`createExpressWebhookHandler`](server/functions/createExpressWebhookHandler.md) | Function | Express middleware |
| [`createNextWebhookHandler`](server/functions/createNextWebhookHandler.md) | Function | Next.js App Router handler |
| [`createNextPagesWebhookHandler`](server/functions/createNextPagesWebhookHandler.md) | Function | Next.js Pages Router handler |
| [`parseNextWebhook`](server/functions/parseNextWebhook.md) | Function | Manual webhook parsing |
