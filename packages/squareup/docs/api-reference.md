# API Reference

Complete API reference for `@bates-solutions/squareup`.

## Core Module

| Export                 | Description                            |
| ---------------------- | -------------------------------------- |
| `createSquareClient`   | Factory for creating Square API client |
| `PaymentsService`      | Payment processing operations          |
| `OrdersService`        | Order management with fluent builder   |
| `CustomersService`     | Customer CRUD and search               |
| `CatalogService`       | Product catalog operations             |
| `InventoryService`     | Stock tracking and adjustments         |
| `SubscriptionsService` | Recurring billing management           |
| `InvoicesService`      | Invoice generation and sending         |
| `LoyaltyService`       | Loyalty program management             |

## React Module (`@bates-solutions/squareup/react`)

| Export             | Description                             |
| ------------------ | --------------------------------------- |
| `SquareProvider`   | Context provider for SDK initialization |
| `useSquare`        | Access Square context                   |
| `useSquarePayment` | Card tokenization hook                  |
| `usePayments`      | Payments API hook                       |
| `useOrders`        | Orders API hook                         |
| `useCustomers`     | Customers API hook                      |
| `useCatalog`       | Catalog API hook                        |
| `CardInput`        | Pre-built card input component          |
| `PaymentButton`    | Google Pay / Apple Pay button           |

## Angular Module (`@bates-solutions/squareup/angular`)

| Export                   | Description                             |
| ------------------------ | --------------------------------------- |
| `SquareModule`           | NgModule with `forRoot()` configuration |
| `SquareSdkService`       | SDK loading service                     |
| `SquarePaymentsService`  | Payment operations                      |
| `SquareOrdersService`    | Order operations                        |
| `SquareCustomersService` | Customer operations                     |
| `SquareCatalogService`   | Catalog operations                      |
| `SquareCardDirective`    | Card input directive                    |
| `PaymentButtonComponent` | Digital wallet component                |

## Server Module (`@bates-solutions/squareup/server`)

| Export                          | Description                        |
| ------------------------------- | ---------------------------------- |
| `verifySignature`               | HMAC-SHA256 signature verification |
| `createExpressWebhookHandler`   | Express middleware                 |
| `createNextWebhookHandler`      | Next.js App Router handler         |
| `createNextPagesWebhookHandler` | Next.js Pages Router handler       |
| `parseNextWebhook`              | Manual webhook parsing             |

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
