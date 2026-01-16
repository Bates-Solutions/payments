# [1.2.0](https://github.com/mbates/squareup/compare/v1.1.0...v1.2.0) (2026-01-16)


### Features

* **checkout:** add CheckoutService for payment links ([f84c4a2](https://github.com/mbates/squareup/commit/f84c4a2236bc121f108b7ae7729bf2797be5c173)), closes [#27](https://github.com/mbates/squareup/issues/27)

# [1.1.0](https://github.com/mbates/squareup/compare/v1.0.0...v1.1.0) (2026-01-14)


### Features

* **catalog:** add upsert method and custom attribute support ([c9aa1a4](https://github.com/mbates/squareup/commit/c9aa1a4e0e9fe2b6f378465200652c8b25cd53eb)), closes [#24](https://github.com/mbates/squareup/issues/24)

# [1.0.0](https://github.com/mbates/squareup/compare/v0.2.0...v1.0.0) (2026-01-10)


* refactor!: remove React and Angular frontend integrations ([764f746](https://github.com/mbates/squareup/commit/764f7463b6c2c5eede5c0402e599b05bebb1fe09))


### BREAKING CHANGES

* React and Angular integrations have been removed.
Users needing frontend payment forms should use Square's Web Payments SDK
directly and communicate with their backend, which can use this library.

# [0.2.0](https://github.com/mbates/squareup/compare/v0.1.0...v0.2.0) (2026-01-10)


### Bug Fixes

* use Node.js 22 for semantic-release ([08e8623](https://github.com/mbates/squareup/commit/08e862310242a4785a1ceaae2e8e54f77fc9d1e8))


### Features

* add semantic-release for automated versioning ([7fca26f](https://github.com/mbates/squareup/commit/7fca26f4adbf8351b28aaa89767a84c315fefa00))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-01-09

### Changed

- CI/CD now auto-publishes to npm on merge to main using trusted publishing (OIDC)

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

#### React Module (`@bates-solutions/squareup/react`)
- `SquareProvider` context provider for SDK initialization
- `useSquare` hook for context access
- `useSquarePayment` hook for card tokenization
- `usePayments`, `useOrders`, `useCustomers`, `useCatalog` hooks
- `CardInput` component with forwardRef and imperative handle
- `PaymentButton` component for Google Pay / Apple Pay

#### Angular Module (`@bates-solutions/squareup/angular`)
- `SquareModule` with `forRoot()` configuration
- `SquareSdkService` for SDK loading with NgZone
- `SquarePaymentsService` for card attach, tokenize, createPayment
- `SquareOrdersService`, `SquareCustomersService`, `SquareCatalogService`
- `SquareCardDirective` for attaching card input to elements
- `PaymentButtonComponent` (standalone) for digital wallets

#### Server Module (`@bates-solutions/squareup/server`)
- Webhook signature verification (HMAC-SHA256 with timing-safe comparison)
- `createExpressWebhookHandler` middleware for Express
- `rawBodyMiddleware` utility for Express
- `createNextWebhookHandler` for Next.js App Router
- `createNextPagesWebhookHandler` for Next.js Pages Router
- `parseNextWebhook` utility for custom handling
- Typed webhook event types for all Square events
