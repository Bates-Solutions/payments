## [1.13.2](https://github.com/mbates/squareup/compare/v1.13.1...v1.13.2) (2026-06-24)


### Bug Fixes

* **customers:** send valid sort_order to avoid Square 400 on text search ([3579c04](https://github.com/mbates/squareup/commit/3579c041d8e073a10736caa24e317c38a467ff46)), closes [#100](https://github.com/mbates/squareup/issues/100)

## [1.13.1](https://github.com/mbates/squareup/compare/v1.13.0...v1.13.1) (2026-06-06)


### Bug Fixes

* **customers:** send valid sort_field to avoid Square 400 on list() ([c83cd95](https://github.com/mbates/squareup/commit/c83cd95ab1bba005dd1e961ab4a3e204067b9e6b)), closes [#82](https://github.com/mbates/squareup/issues/82)

# [1.13.0](https://github.com/mbates/squareup/compare/v1.12.0...v1.13.0) (2026-04-20)


### Features

* **gift-cards:** add GiftCardsService with full lifecycle support ([5e15b25](https://github.com/mbates/squareup/commit/5e15b2596ca60425af658f9a22748e04442b1a9d)), closes [#69](https://github.com/mbates/squareup/issues/69)

# [1.12.0](https://github.com/mbates/squareup/compare/v1.11.0...v1.12.0) (2026-04-20)


### Bug Fixes

* address PR review feedback ([9baef79](https://github.com/mbates/squareup/commit/9baef794069ed273ff5814758621a3476f84b98b))


### Features

* **subscriptions:** support order-template phases + extend order creation ([f718265](https://github.com/mbates/squareup/commit/f7182650c69be273b45fb463895e9e4b28e389ac)), closes [#71](https://github.com/mbates/squareup/issues/71)

# [1.11.0](https://github.com/mbates/squareup/compare/v1.10.0...v1.11.0) (2026-04-19)


### Features

* **catalog:** add SUBSCRIPTION_PLAN and SUBSCRIPTION_PLAN_VARIATION object types ([3f3e038](https://github.com/mbates/squareup/commit/3f3e0381f33e42609f4dc64b40c58518aecfd435)), closes [#67](https://github.com/mbates/squareup/issues/67)

# [1.10.0](https://github.com/mbates/squareup/compare/v1.9.0...v1.10.0) (2026-04-14)


### Features

* **catalog:** add PRICING_RULE, PRODUCT_SET, TIME_PERIOD and customer groups ([8c7a7eb](https://github.com/mbates/squareup/commit/8c7a7eb22782ad3637048333899fa8135ef0fcc8)), closes [#59](https://github.com/mbates/squareup/issues/59)

# [1.9.0](https://github.com/mbates/squareup/compare/v1.8.0...v1.9.0) (2026-04-07)


### Bug Fixes

* **webhooks:** omit empty arg in default logger output ([1262b1d](https://github.com/mbates/squareup/commit/1262b1db8c4ce73fcd93989eae3e63d253fdd4b0))
* **webhooks:** simplify default logger and improve test coverage ([037652e](https://github.com/mbates/squareup/commit/037652e0981b0a6065cab8e6b3a227647e5bb3d9))
* **webhooks:** use if/else instead of ternary in default logger ([61b1e4e](https://github.com/mbates/squareup/commit/61b1e4ef2ba78a3712a12c9b1d2a9d7f400f008b))


### Features

* **webhooks:** add logging and onUnhandledEvent to Lambda handler ([3669a0d](https://github.com/mbates/squareup/commit/3669a0d19e869092d54003dca76bdb96458e53ba)), closes [#57](https://github.com/mbates/squareup/issues/57)

# [1.8.0](https://github.com/mbates/squareup/compare/v1.7.0...v1.8.0) (2026-04-06)


### Bug Fixes

* **orders:** use typed Square objects in searchRecent ([13c4309](https://github.com/mbates/squareup/commit/13c4309f348fb76de58f857ac0b47a526dd91407))


### Features

* **orders:** add searchRecent() convenience method ([4754a21](https://github.com/mbates/squareup/commit/4754a218bea5567140a6a5b02f0c033f5513460e)), closes [#52](https://github.com/mbates/squareup/issues/52)

# [1.7.0](https://github.com/mbates/squareup/compare/v1.6.0...v1.7.0) (2026-04-05)


### Bug Fixes

* **webhooks:** address Lambda handler PR review feedback ([02bb45e](https://github.com/mbates/squareup/commit/02bb45ea0f40069d3a58a03e8b687e07d54e35cc))


### Features

* **webhooks:** add createLambdaWebhookHandler for serverless ([570b661](https://github.com/mbates/squareup/commit/570b66138ea6f485696eca511f218e5b3e473914)), closes [#53](https://github.com/mbates/squareup/issues/53)

# [1.6.0](https://github.com/mbates/squareup/compare/v1.5.2...v1.6.0) (2026-04-05)


### Bug Fixes

* **webhooks:** address PR review feedback ([e69ca29](https://github.com/mbates/squareup/commit/e69ca2976661f00dcc9e9ddf9a38e1581f0789bf))


### Features

* **webhooks:** add typed event payloads and entity ID helpers ([bf320df](https://github.com/mbates/squareup/commit/bf320dff35b9f5077bb8ad26c8e1faad1c2b7622)), closes [#51](https://github.com/mbates/squareup/issues/51)

## [1.5.2](https://github.com/mbates/squareup/compare/v1.5.1...v1.5.2) (2026-04-05)


### Bug Fixes

* **customers:** use page.response.customers instead of page.data ([d6acbec](https://github.com/mbates/squareup/commit/d6acbec8e7512bae45272fe8b9b7ff6f9a93881f)), closes [#49](https://github.com/mbates/squareup/issues/49)

## [1.5.1](https://github.com/mbates/squareup/compare/v1.5.0...v1.5.1) (2026-04-05)


### Bug Fixes

* **deps:** bump typedoc to 0.28.18 for TypeScript 6.x support ([e72db7b](https://github.com/mbates/squareup/commit/e72db7b7281ebd784d4e0d79947dcd8fa3e05132))

# [1.5.0](https://github.com/mbates/squareup/compare/v1.4.0...v1.5.0) (2026-04-04)


### Bug Fixes

* **customers:** trim whitespace query and fix mid-page cursor skip ([a378118](https://github.com/mbates/squareup/commit/a378118d5715031260506b679247b5561133ead7))


### Features

* **customers:** implement query-based search with client-side filtering ([ccd798a](https://github.com/mbates/squareup/commit/ccd798ac5c1fe9c6f0155814f612cbbbd2c955c5)), closes [#46](https://github.com/mbates/squareup/issues/46)

# [1.4.0](https://github.com/mbates/squareup/compare/v1.3.0...v1.4.0) (2026-03-28)


### Bug Fixes

* resolve eslint no-unnecessary-condition error ([24846a3](https://github.com/mbates/squareup/commit/24846a3cd62d75e998aeb360b843a29c45d322a6))
* use list endpoint instead of search for customers.list() ([486a853](https://github.com/mbates/squareup/commit/486a8532c088792b2f765502f18dcb7a3b77534e))


### Features

* **customers:** add cursor passthrough support to customers.list() ([f86a23b](https://github.com/mbates/squareup/commit/f86a23b145d8cdf04fce34f0b938ef4a68e03835)), closes [#42](https://github.com/mbates/squareup/issues/42)

# [1.3.0](https://github.com/mbates/squareup/compare/v1.2.1...v1.3.0) (2026-01-20)


### Features

* **orders:** add query filter support to orders.search() ([09530fa](https://github.com/mbates/squareup/commit/09530fa2e42e7574ac96380575bbfe57cd7aa33c)), closes [#28](https://github.com/mbates/squareup/issues/28) [#25](https://github.com/mbates/squareup/issues/25) [#30](https://github.com/mbates/squareup/issues/30) [#33](https://github.com/mbates/squareup/issues/33)

## [1.2.1](https://github.com/mbates/squareup/compare/v1.2.0...v1.2.1) (2026-01-17)


### Bug Fixes

* **catalog:** use explicit pagination in list() method ([a267b3e](https://github.com/mbates/squareup/commit/a267b3e597ef4222fe3ae34fe62feb4201afaf35)), closes [#29](https://github.com/mbates/squareup/issues/29)

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
