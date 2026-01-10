# API Reference

Complete API reference for `@bates-solutions/squareup`.

> **Full Documentation**: For detailed API documentation with method signatures, parameters, and examples, see the [generated TypeDoc reference](./api/README.md).

## Core Module

[Full Core API Reference](./api/core/README.md)

| Export                 | Description                            | Docs |
| ---------------------- | -------------------------------------- | ---- |
| `createSquareClient`   | Factory for creating Square API client | [→](./api/core/functions/createSquareClient.md) |
| `PaymentsService`      | Payment processing operations          | [→](./api/core/classes/PaymentsService.md) |
| `OrdersService`        | Order management with fluent builder   | [→](./api/core/classes/OrdersService.md) |
| `CustomersService`     | Customer CRUD and search               | [→](./api/core/classes/CustomersService.md) |
| `CatalogService`       | Product catalog operations             | [→](./api/core/classes/CatalogService.md) |
| `InventoryService`     | Stock tracking and adjustments         | [→](./api/core/classes/InventoryService.md) |
| `SubscriptionsService` | Recurring billing management           | [→](./api/core/classes/SubscriptionsService.md) |
| `InvoicesService`      | Invoice generation and sending         | [→](./api/core/classes/InvoicesService.md) |
| `LoyaltyService`       | Loyalty program management             | [→](./api/core/classes/LoyaltyService.md) |

## React Module (`@bates-solutions/squareup/react`)

[Full React API Reference](./api/react/README.md)

| Export             | Description                             | Docs |
| ------------------ | --------------------------------------- | ---- |
| `SquareProvider`   | Context provider for SDK initialization | [→](./api/react/functions/SquareProvider.md) |
| `useSquare`        | Access Square context                   | [→](./api/react/functions/useSquare.md) |
| `useSquarePayment` | Card tokenization hook                  | [→](./api/react/functions/useSquarePayment.md) |
| `usePayments`      | Payments API hook                       | [→](./api/react/functions/usePayments.md) |
| `useOrders`        | Orders API hook                         | [→](./api/react/functions/useOrders.md) |
| `useCustomers`     | Customers API hook                      | [→](./api/react/functions/useCustomers.md) |
| `useCatalog`       | Catalog API hook                        | [→](./api/react/functions/useCatalog.md) |
| `CardInput`        | Pre-built card input component          | [→](./api/react/variables/CardInput.md) |
| `PaymentButton`    | Google Pay / Apple Pay button           | [→](./api/react/functions/PaymentButton.md) |

## Angular Module (`@bates-solutions/squareup/angular`)

[Full Angular API Reference](./api/angular/README.md)

| Export                   | Description                             | Docs |
| ------------------------ | --------------------------------------- | ---- |
| `SquareModule`           | NgModule with `forRoot()` configuration | [→](./api/angular/classes/SquareModule.md) |
| `SquareSdkService`       | SDK loading service                     | [→](./api/angular/classes/SquareSdkService.md) |
| `SquarePaymentsService`  | Payment operations                      | [→](./api/angular/classes/SquarePaymentsService.md) |
| `SquareOrdersService`    | Order operations                        | [→](./api/angular/classes/SquareOrdersService.md) |
| `SquareCustomersService` | Customer operations                     | [→](./api/angular/classes/SquareCustomersService.md) |
| `SquareCatalogService`   | Catalog operations                      | [→](./api/angular/classes/SquareCatalogService.md) |
| `SquareCardDirective`    | Card input directive                    | [→](./api/angular/classes/SquareCardDirective.md) |
| `PaymentButtonComponent` | Digital wallet component                | [→](./api/angular/classes/PaymentButtonComponent.md) |

## Server Module (`@bates-solutions/squareup/server`)

[Full Server API Reference](./api/server/README.md)

| Export                          | Description                        | Docs |
| ------------------------------- | ---------------------------------- | ---- |
| `verifySignature`               | HMAC-SHA256 signature verification | [→](./api/server/functions/verifySignature.md) |
| `createExpressWebhookHandler`   | Express middleware                 | [→](./api/server/functions/createExpressWebhookHandler.md) |
| `createNextWebhookHandler`      | Next.js App Router handler         | [→](./api/server/functions/createNextWebhookHandler.md) |
| `createNextPagesWebhookHandler` | Next.js Pages Router handler       | [→](./api/server/functions/createNextPagesWebhookHandler.md) |
| `parseNextWebhook`              | Manual webhook parsing             | [→](./api/server/functions/parseNextWebhook.md) |

## Money Utilities

```typescript
import { toCents, fromCents, formatMoney } from '@bates-solutions/squareup';

toCents(10.99); // 1099
fromCents(1099); // 10.99
formatMoney(1099, 'USD'); // '$10.99'
```

## Error Handling

```typescript
import {
  SquareApiError,
  SquareValidationError,
  SquareNetworkError,
  SquareAuthenticationError
} from '@bates-solutions/squareup';

try {
  await square.payments.create({ ... });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.log('Invalid input:', error.errors);
  } else if (error instanceof SquareAuthenticationError) {
    console.log('Check your access token');
  } else if (error instanceof SquareNetworkError) {
    console.log('Network issue, retry later');
  }
}
```

## Configuration

| Option          | Type                        | Required      | Description                            |
| --------------- | --------------------------- | ------------- | -------------------------------------- |
| `accessToken`   | `string`                    | Yes           | Square API access token                |
| `environment`   | `'sandbox' \| 'production'` | No            | API environment (default: `'sandbox'`) |
| `applicationId` | `string`                    | React/Angular | Web Payments SDK application ID        |
| `locationId`    | `string`                    | React/Angular | Square location ID                     |
