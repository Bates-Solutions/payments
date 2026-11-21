[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateCardOptions

# Interface: CreateCardOptions

Defined in: [squareup/src/core/types/index.ts:345](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L345)

Options for `cards.create()`: store a card on file for a customer.

## Properties

### billingAddress?

> `optional` **billingAddress?**: `Address`

Defined in: [squareup/src/core/types/index.ts:359](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L359)

***

### cardholderName?

> `optional` **cardholderName?**: `string`

Defined in: [squareup/src/core/types/index.ts:358](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L358)

***

### customerId

> **customerId**: `string`

Defined in: [squareup/src/core/types/index.ts:352](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L352)

The customer the card belongs to.

***

### idempotencyKey

> **idempotencyKey**: `string`

Defined in: [squareup/src/core/types/index.ts:357](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L357)

Required. Square stores the card once per key, so a retry with the same
key cannot create a second card. At most 45 characters.

***

### referenceId?

> `optional` **referenceId?**: `string`

Defined in: [squareup/src/core/types/index.ts:361](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L361)

Your own ID for the card, for example a user ID.

***

### sourceId

> **sourceId**: `string`

Defined in: [squareup/src/core/types/index.ts:350](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L350)

The card to store: a card nonce from the Web Payments SDK, or the ID of a
payment made with the card.
