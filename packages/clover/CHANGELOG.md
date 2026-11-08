# Changelog

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
