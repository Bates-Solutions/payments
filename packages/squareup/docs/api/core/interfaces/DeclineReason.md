[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / DeclineReason

# Interface: DeclineReason

Defined in: [squareup/src/core/errors.ts:323](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L323)

What a card decline means for charging the same card again.

## Properties

### code

> **code**: `string`

Defined in: [squareup/src/core/errors.ts:325](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L325)

Square's error code, for example `GENERIC_DECLINE` or `INSUFFICIENT_FUNDS`.

***

### retryable

> **retryable**: `boolean`

Defined in: [squareup/src/core/errors.ts:335](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/errors.ts#L335)

Whether charging the same card again later, without the buyer doing
anything, can succeed. When `false`, ask the buyer for another card (or to
fix this one) instead of retrying: repeated attempts on a hard decline
can get the merchant flagged by the card networks.

A retry of a declined charge is a new payment attempt, so give it a new
idempotency key: Square answers a reused key with the original decline.
