[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / ListCardsOptions

# Interface: ListCardsOptions

Defined in: [squareup/src/core/types/index.ts:367](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L367)

Options for `cards.list()`.

## Properties

### cursor?

> `optional` **cursor?**: `string`

Defined in: [squareup/src/core/types/index.ts:373](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L373)

The `cursor` from a previous page.

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [squareup/src/core/types/index.ts:369](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L369)

Only the cards of this customer. By default, every card of the merchant.

***

### includeDisabled?

> `optional` **includeDisabled?**: `boolean`

Defined in: [squareup/src/core/types/index.ts:371](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L371)

Include disabled cards. Default `false`.
