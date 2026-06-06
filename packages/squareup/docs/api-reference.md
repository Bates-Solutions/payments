# API Reference

Complete API reference for `@bates-solutions/squareup`.

> **Full Documentation**: For detailed API documentation with method signatures, parameters, and examples, see the [generated TypeDoc reference](./api/README.md). Usage guides for each service live in [`docs/guides/`](./guides/).

The package ships two entry points:

- `@bates-solutions/squareup` — the core API client and services
- `@bates-solutions/squareup/server` — webhook verification and handlers

## Core Module

[Full Core API Reference](./api/core/README.md)

| Export                       | Description                                                  | Docs |
| ---------------------------- | ----------------------------------------------------------- | ---- |
| `createSquareClient`         | Factory for creating a Square API client                    | [→](./api/core/functions/createSquareClient.md) |
| `SquareClient`               | Client class exposing every service                         | [→](./api/core/classes/SquareClient.md) |
| `PaymentsService`            | Payment processing operations                               | [→](./api/core/classes/PaymentsService.md) |
| `OrdersService`              | Order management with fluent builder                        | [→](./api/core/classes/OrdersService.md) |
| `OrderBuilder`               | Fluent builder for order line items and pricing             | [→](./api/core/classes/OrderBuilder.md) |
| `CustomersService`           | Customer CRUD, list, and search                             | [→](./api/core/classes/CustomersService.md) |
| `CustomerGroupsService`      | Customer groups and group membership                        | [→](./api/core/classes/CustomerGroupsService.md) |
| `CatalogService`             | Product catalog, pricing rules, and wholesale pricing       | [→](./api/core/classes/CatalogService.md) |
| `InventoryService`           | Stock tracking and adjustments                              | [→](./api/core/classes/InventoryService.md) |
| `SubscriptionsService`       | Recurring billing, incl. phases backed by order templates   | [→](./api/core/classes/SubscriptionsService.md) |
| `InvoicesService`            | Invoice generation and sending                              | [→](./api/core/classes/InvoicesService.md) |
| `LoyaltyService`             | Loyalty program management                                  | [→](./api/core/classes/LoyaltyService.md) |
| `CheckoutService`            | Hosted checkout sessions                                    | [→](./api/core/classes/CheckoutService.md) |
| `GiftCardsService`           | Gift card lifecycle (issue, activate, load, redeem)         | [→](./api/core/classes/GiftCardsService.md) |
| `GiftCardActivitiesService`  | Gift card activity history                                  | [→](./api/core/classes/GiftCardActivitiesService.md) |

## Server Module (`@bates-solutions/squareup/server`)

[Full Server API Reference](./api/server/README.md)

| Export                          | Description                              | Docs |
| ------------------------------- | ---------------------------------------- | ---- |
| `verifySignature`               | HMAC-SHA256 webhook signature verification | [→](./api/server/functions/verifySignature.md) |
| `parseWebhookEvent`             | Parse a raw webhook body into an event   | [→](./api/server/functions/parseWebhookEvent.md) |
| `parseAndVerifyWebhook`         | Verify the signature and parse in one step | [→](./api/server/functions/parseAndVerifyWebhook.md) |
| `processWebhookEvent`           | Route a parsed event to its handler      | [→](./api/server/functions/processWebhookEvent.md) |
| `createWebhookProcessor`        | Build a reusable event processor         | [→](./api/server/functions/createWebhookProcessor.md) |
| `createExpressWebhookHandler`   | Express middleware                       | [→](./api/server/functions/createExpressWebhookHandler.md) |
| `createNextWebhookHandler`      | Next.js App Router handler               | [→](./api/server/functions/createNextWebhookHandler.md) |
| `createNextPagesWebhookHandler` | Next.js Pages Router handler             | [→](./api/server/functions/createNextPagesWebhookHandler.md) |
| `parseNextWebhook`              | Manual Next.js webhook parsing           | [→](./api/server/functions/parseNextWebhook.md) |
| `createLambdaWebhookHandler`    | AWS Lambda proxy handler                 | [→](./api/server/functions/createLambdaWebhookHandler.md) |

Helpers `getPaymentId`, `getOrderId`, and `getCustomerId` extract the affected
object's ID from a parsed webhook event.

## Money Utilities

```typescript
import { toCents, fromCents, formatMoney } from '@bates-solutions/squareup';

toCents(10.99); // 1099n
fromCents(1099n); // 10.99
formatMoney(1099n, 'USD'); // '$10.99'
```

Money amounts are handled as `bigint` cents throughout the library.

## Error Handling

All service methods throw a subclass of `SquareError` on failure:

```typescript
import {
  SquareError,
  SquareApiError,
  SquareAuthError,
  SquarePaymentError,
  SquareValidationError,
} from '@bates-solutions/squareup';

try {
  await client.payments.create({ ... });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.log('Invalid input:', error.message);
  } else if (error instanceof SquareAuthError) {
    console.log('Check your access token');
  } else if (error instanceof SquarePaymentError) {
    console.log('Payment declined or failed');
  } else if (error instanceof SquareApiError) {
    console.log('Square API error:', error.message);
  }
}
```

| Error                    | Thrown when                                        |
| ------------------------ | -------------------------------------------------- |
| `SquareValidationError`  | Input fails the wrapper's validation               |
| `SquareAuthError`        | Authentication is rejected (bad/expired token)     |
| `SquarePaymentError`     | A payment is declined or cannot be processed       |
| `SquareApiError`         | Any other Square API error                         |
| `SquareError`            | Base class for all of the above                    |

## Configuration

| Option            | Type                        | Required | Description                            |
| ----------------- | --------------------------- | -------- | -------------------------------------- |
| `accessToken`     | `string`                    | Yes      | Square API access token                |
| `environment`     | `'sandbox' \| 'production'` | No       | API environment (default: `'sandbox'`) |
| `locationId`      | `string`                    | No       | Default location ID for operations that require one |
| `defaultCurrency` | `string`                    | No       | Default currency code (default: `'USD'`) |
