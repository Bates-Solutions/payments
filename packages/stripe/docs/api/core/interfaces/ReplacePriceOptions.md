[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ReplacePriceOptions

# Interface: ReplacePriceOptions

Defined in: [core/services/prices.service.ts:97](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L97)

Options for [PricesService.replace](../classes/PricesService.md#replace). Anything you omit is copied from
the price being replaced.

## Properties

### currency?

> `optional` **currency?**: `string`

Defined in: [core/services/prices.service.ts:101](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L101)

New currency (defaults to the old price's currency)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/prices.service.ts:113](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L113)

Idempotency key for the whole replacement (defaults to a generated UUID).
Each underlying call uses a key derived from it, so retrying a failed
`replace` with the same key never creates a second new price.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/prices.service.ts:107](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L107)

New metadata (defaults to a copy of the old price's metadata)

***

### nickname?

> `optional` **nickname?**: `string`

Defined in: [core/services/prices.service.ts:105](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L105)

New nickname (defaults to the old one)

***

### recurring?

> `optional` **recurring?**: [`PriceRecurring`](PriceRecurring.md)

Defined in: [core/services/prices.service.ts:103](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L103)

New interval (defaults to the old price's interval, if it was recurring)

***

### unitAmount

> **unitAmount**: `number`

Defined in: [core/services/prices.service.ts:99](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L99)

New amount in the smallest currency unit. A non-negative integer.
