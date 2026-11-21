[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreatePaymentOptions

# Interface: CreatePaymentOptions

Defined in: [squareup/src/core/types/index.ts:83](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L83)

Create payment options

## Properties

### amount

> **amount**: `number`

Defined in: [squareup/src/core/types/index.ts:85](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L85)

***

### autocomplete?

> `optional` **autocomplete?**: `boolean`

Defined in: [squareup/src/core/types/index.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L91)

***

### buyerEmailAddress?

> `optional` **buyerEmailAddress?**: `string`

Defined in: [squareup/src/core/types/index.ts:110](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L110)

The buyer's email address, for the receipt and risk checks.

***

### currency?

> `optional` **currency?**: `"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

Defined in: [squareup/src/core/types/index.ts:86](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L86)

***

### customerDetails?

> `optional` **customerDetails?**: `object`

Defined in: [squareup/src/core/types/index.ts:105](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L105)

Who started the payment. Set `customerInitiated: false` for a charge of a
card on file that the buyer did not start (a merchant-initiated
transaction, such as a renewal); `sellerKeyedIn: true` when the seller
typed in the card details.

#### customerInitiated?

> `optional` **customerInitiated?**: `boolean`

#### sellerKeyedIn?

> `optional` **sellerKeyedIn?**: `boolean`

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [squareup/src/core/types/index.ts:87](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L87)

***

### idempotencyKey

> **idempotencyKey**: `string`

Defined in: [squareup/src/core/types/index.ts:98](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L98)

Required. Square takes the payment once per key, so a retry with the same key cannot
charge twice. Reuse a key only to resend the identical request (for example
after a network error); see [createIdempotencyKey](../functions/createIdempotencyKey.md). At most 45
characters.

***

### note?

> `optional` **note?**: `string`

Defined in: [squareup/src/core/types/index.ts:90](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L90)

***

### orderId?

> `optional` **orderId?**: `string`

Defined in: [squareup/src/core/types/index.ts:88](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L88)

***

### referenceId?

> `optional` **referenceId?**: `string`

Defined in: [squareup/src/core/types/index.ts:89](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L89)

***

### sourceId

> **sourceId**: `string`

Defined in: [squareup/src/core/types/index.ts:84](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L84)

***

### statementDescriptionIdentifier?

> `optional` **statementDescriptionIdentifier?**: `string`

Defined in: [squareup/src/core/types/index.ts:115](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L115)

Text added to the seller's name on the buyer's card statement (Square
truncates the combined text to the card network's limit).

***

### verificationToken?

> `optional` **verificationToken?**: `string`

Defined in: [squareup/src/core/types/index.ts:122](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L122)

A buyer verification token from the Web Payments SDK `verifyBuyer()`.
Square has deprecated `verifyBuyer()` (`tokenize()` now runs buyer
verification itself), so new integrations should leave this unset; it is
kept for integrations that still send one.
