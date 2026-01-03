# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-01-03

### Added

#### Core Module
- `createSquareClient` factory for creating Square API client
- Typed error classes (`SquareApiError`, `SquareValidationError`, `SquareNetworkError`, `SquareAuthenticationError`)
- Money utilities (`toCents`, `fromCents`, `formatMoney`)
- ID generation utilities (`generateIdempotencyKey`)
- PaymentsService with simplified payment processing
- OrdersService with fluent builder pattern
- CustomersService (CRUD + search)
- CatalogService (list, search, batch retrieve)
- InventoryService (counts, adjustments)
- SubscriptionsService (create, cancel, pause/resume)
- InvoicesService (create, send, cancel)
- LoyaltyService (accounts, points, rewards)

#### React Module (`@bates/squareup/react`)
- `SquareProvider` context provider for SDK initialization
- `useSquare` hook for context access
- `useSquarePayment` hook for card tokenization
- `usePayments`, `useOrders`, `useCustomers`, `useCatalog` hooks
- `CardInput` component with forwardRef and imperative handle
- `PaymentButton` component for Google Pay / Apple Pay

#### Angular Module (`@bates/squareup/angular`)
- `SquareModule` with `forRoot()` configuration
- `SquareSdkService` for SDK loading with NgZone
- `SquarePaymentsService` for card attach, tokenize, createPayment
- `SquareOrdersService`, `SquareCustomersService`, `SquareCatalogService`
- `SquareCardDirective` for attaching card input to elements
- `PaymentButtonComponent` (standalone) for digital wallets

#### Server Module (`@bates/squareup/server`)
- Webhook signature verification (HMAC-SHA256 with timing-safe comparison)
- `createExpressWebhookHandler` middleware for Express
- `rawBodyMiddleware` utility for Express
- `createNextWebhookHandler` for Next.js App Router
- `createNextPagesWebhookHandler` for Next.js Pages Router
- `parseNextWebhook` utility for custom handling
- Typed webhook event types for all Square events
