[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreatePriceOptions

# Interface: CreatePriceOptions

Defined in: [core/services/prices.service.ts:45](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L45)

Options for creating a price

## Properties

### active?

> `optional` **active?**: `boolean`

Defined in: [core/services/prices.service.ts:67](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L67)

Whether the price can be used for new purchases.

#### Default

```ts
true
```

***

### currency

> **currency**: `string`

Defined in: [core/services/prices.service.ts:51](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L51)

Lowercase ISO currency code (e.g. `usd`)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/prices.service.ts:71](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L71)

Idempotency key (defaults to a generated UUID)

***

### lookupKey?

> `optional` **lookupKey?**: `string`

Defined in: [core/services/prices.service.ts:57](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L57)

Your own stable key for looking the price up (must be unique per account)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/prices.service.ts:69](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L69)

Key/value metadata, e.g. your own id for the price

***

### nickname?

> `optional` **nickname?**: `string`

Defined in: [core/services/prices.service.ts:55](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L55)

Internal label, not shown to customers

***

### product

> **product**: `string`

Defined in: [core/services/prices.service.ts:47](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L47)

Product the price belongs to (`prod_…`)

***

### recurring?

> `optional` **recurring?**: [`PriceRecurring`](PriceRecurring.md)

Defined in: [core/services/prices.service.ts:53](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L53)

Make it a recurring price. Omit for a one-time price.

***

### transferLookupKey?

> `optional` **transferLookupKey?**: `boolean`

Defined in: [core/services/prices.service.ts:62](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L62)

Move `lookupKey` from the price that currently holds it to this one.

#### Default

```ts
false
```

***

### unitAmount

> **unitAmount**: `number`

Defined in: [core/services/prices.service.ts:49](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/prices.service.ts#L49)

Amount in the smallest currency unit (e.g. cents). A non-negative integer.
