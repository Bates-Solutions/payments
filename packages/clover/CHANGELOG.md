# Changelog

## [1.3.0](https://github.com/Bates-Solutions/payments/compare/clover-v1.2.1...clover-v1.3.0) (2026-11-21)


### Features

* **clover:** make the money helpers currency-aware ([859349e](https://github.com/Bates-Solutions/payments/commit/859349ec68b906fab66a1f5e23896d1408cbad18))
* **clover:** make toCents, fromCents and formatMoney currency-aware ([8ac42ca](https://github.com/Bates-Solutions/payments/commit/8ac42ca06ed4303782230605cfd7aacef5455a40))

## [1.2.1](https://github.com/Bates-Solutions/payments/compare/clover-v1.2.0...clover-v1.2.1) (2026-11-21)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @bates-solutions/payments-core bumped from ^0.1.0 to ^0.2.0

## [1.2.0](https://github.com/Bates-Solutions/payments/compare/clover-v1.1.0...clover-v1.2.0) (2026-11-20)


### Features

* **payments-core:** match instanceof PaymentsError across copies of the package ([58d0b04](https://github.com/Bates-Solutions/payments/commit/58d0b0464c2b9b8e6bc40cde4bbdb60dd3797ce7))
* PaymentsError base class and shared helpers in payments-core (S9) ([b3aeeb9](https://github.com/Bates-Solutions/payments/commit/b3aeeb9599de996f854a9f05c928072278e62cc5))
* **squareup,stripe,clover:** extend PaymentsError and use core helpers ([1eca758](https://github.com/Bates-Solutions/payments/commit/1eca7583a03d2f3ce65c438afabcbb96c29e4973))
* verify webhook signatures with payments-core in all three providers (S8) ([da67efa](https://github.com/Bates-Solutions/payments/commit/da67efaadd3335f5ab1f8c843cef343df53c4c6e))


### Bug Fixes

* **payments-core:** address PR review feedback ([d371287](https://github.com/Bates-Solutions/payments/commit/d37128768f64e85ebe520145b984dd5103714fcb))

## [1.1.0](https://github.com/Bates-Solutions/clover/compare/v1.0.4...v1.1.0) (2026-11-08)


### Features

* **oauth:** v2 OAuth for Clover apps. `buildAuthorizeUrl` builds the authorize URL (sandbox or North America, `state` required), and `createCloverOAuthClient` gives `obtainToken` (`POST /oauth/v2/token`) and `refreshToken` (`POST /oauth/v2/refresh`). Both return `{ accessToken, expiresAt, refreshToken, refreshTokenExpiresAt }`. The app secret is kept in a private field, so it never shows up in logs or errors. A new OAuth guide shows the callback state check: store it, require it, use it once, then compare ([#21](https://github.com/Bates-Solutions/clover/pull/21)), closes [#15](https://github.com/Bates-Solutions/clover/issues/15)
* **inventory:** `clover.inventory` with `listItems`, `getItem`, `findItemsByCode` (matches `itemCode` and `sku`, pages through every match, returns each item once), `createItem`, `updateItem`, `getItemStock` and `updateItemStock`. Array query values are now sent as repeated parameters, so several `filter` params work ([#22](https://github.com/Bates-Solutions/clover/pull/22)), closes [#16](https://github.com/Bates-Solutions/clover/issues/16)
* **orders:** `clover.orders` with `list` and `get`. `list` turns `createdTimeFrom` (inclusive) and `createdTimeTo` (exclusive) into `createdTime` filters, and also takes `state`, raw filters, typed expand and limit/offset (validated to 1..1000 and >= 0). Expanded collections, including the nested line-item ones, come back as plain arrays instead of Clover's `{ elements }` wrapper ([#23](https://github.com/Bates-Solutions/clover/pull/23)), closes [#17](https://github.com/Bates-Solutions/clover/issues/17)


### Miscellaneous

* Repository, bug and homepage URLs point at the Bates-Solutions org ([#20](https://github.com/Bates-Solutions/clover/pull/20))
* Dev dependency bumps: vitest and `@vitest/coverage-v8` 5.1.0, TypeScript held at 6.0.3. They supersede Dependabot #19 and #13 ([#24](https://github.com/Bates-Solutions/clover/pull/24))

## Earlier versions

Release notes for 1.0.1 to 1.0.4 are on the [GitHub releases page](https://github.com/Bates-Solutions/clover/releases).
