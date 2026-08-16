[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / GiftCardState

# Type Alias: GiftCardState

> **GiftCardState** = `"PENDING"` \| `"ACTIVE"` \| `"DEACTIVATED"` \| `"BLOCKED"` \| `"UNLINKED_OWNER"`

Defined in: [core/services/gift-cards.service.ts:25](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/services/gift-cards.service.ts#L25)

Lifecycle state of a gift card.

New cards start in `PENDING` and require an `ACTIVATE` activity before they
can be redeemed.
