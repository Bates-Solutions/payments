[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / UpdatePriceOptions

# Interface: UpdatePriceOptions

Defined in: [core/services/prices.service.ts:78](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L78)

Options for updating a price. A price's amount, currency and interval are
immutable; to change them use [PricesService.replace](../classes/PricesService.md#replace).

## Properties

### active?

> `optional` **active?**: `boolean`

Defined in: [core/services/prices.service.ts:80](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L80)

Deactivate (`false`) or reactivate (`true`) the price

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/prices.service.ts:90](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L90)

Idempotency key (defaults to a generated UUID)

***

### lookupKey?

> `optional` **lookupKey?**: `string`

Defined in: [core/services/prices.service.ts:84](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L84)

Your own stable key for looking the price up

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/prices.service.ts:88](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L88)

Metadata to merge into the existing metadata. Set a key to `''` to remove it.

***

### nickname?

> `optional` **nickname?**: `string`

Defined in: [core/services/prices.service.ts:82](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L82)

Internal label

***

### transferLookupKey?

> `optional` **transferLookupKey?**: `boolean`

Defined in: [core/services/prices.service.ts:86](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L86)

Move `lookupKey` from the price that currently holds it to this one
