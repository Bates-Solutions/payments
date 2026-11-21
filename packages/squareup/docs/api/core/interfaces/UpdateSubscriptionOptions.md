[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / UpdateSubscriptionOptions

# Interface: UpdateSubscriptionOptions

Defined in: [squareup/src/core/services/subscriptions.service.ts:140](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L140)

Options for `subscriptions.update()`. Only the fields you set change.

## Properties

### cardId?

> `optional` **cardId?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:153](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L153)

Card on file to bill, for example a new card from `cards.create()`.

***

### priceOverride?

> `optional` **priceOverride?**: `number`

Defined in: [squareup/src/core/services/subscriptions.service.ts:151](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L151)

New recurring price in cents, in the client's `defaultCurrency`. Prefer
`priceOverrideMoney`; a `0` here is ignored (no override is sent).

***

### priceOverrideMoney?

> `optional` **priceOverrideMoney?**: `object`

Defined in: [squareup/src/core/services/subscriptions.service.ts:146](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L146)

New recurring price, in the smallest currency unit (cents). `currency`
defaults to the client's `defaultCurrency`. `amount: 0` makes the
subscription free.

#### amount

> **amount**: `number` \| `bigint`

#### currency?

> `optional` **currency?**: `"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

***

### taxPercentage?

> `optional` **taxPercentage?**: `string`

Defined in: [squareup/src/core/services/subscriptions.service.ts:155](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/services/subscriptions.service.ts#L155)

Tax rate as a percentage string, for example `"8.5"`.
