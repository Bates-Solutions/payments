[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrderDiscountInput

# Interface: OrderDiscountInput

Defined in: [squareup/src/core/types/index.ts:170](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L170)

An order discount. Reference an existing `CatalogDiscount` by
`catalogObjectId` (keeps the catalog authoritative — the price tracks the
rule), or define an ad-hoc discount inline with `type` + `percentage`/`amountMoney`.

## See

https://developer.squareup.com/docs/orders-api/discounts

## Properties

### amountMoney?

> `optional` **amountMoney?**: `object`

Defined in: [squareup/src/core/types/index.ts:180](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L180)

Fixed amount (for amount types).

#### amount

> **amount**: `number` \| `bigint`

#### currency

> **currency**: `"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

***

### catalogObjectId?

> `optional` **catalogObjectId?**: `string`

Defined in: [squareup/src/core/types/index.ts:174](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L174)

Reference an existing `CatalogDiscount` by id.

***

### name?

> `optional` **name?**: `string`

Defined in: [squareup/src/core/types/index.ts:175](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L175)

***

### percentage?

> `optional` **percentage?**: `string`

Defined in: [squareup/src/core/types/index.ts:178](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L178)

Percentage as a string, e.g. `"7.25"` (for percentage types).

***

### scope?

> `optional` **scope?**: [`OrderDiscountScope`](../type-aliases/OrderDiscountScope.md)

Defined in: [squareup/src/core/types/index.ts:186](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L186)

`ORDER` applies to the whole order (Square auto-applies to every line);
`LINE_ITEM` applies only to lines that list this discount's `uid` in their
`appliedDiscounts`.

***

### type?

> `optional` **type?**: [`OrderDiscountType`](../type-aliases/OrderDiscountType.md)

Defined in: [squareup/src/core/types/index.ts:176](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L176)

***

### uid?

> `optional` **uid?**: `string`

Defined in: [squareup/src/core/types/index.ts:172](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L172)

Client-side id; reference it from a line item's `appliedDiscounts`.
