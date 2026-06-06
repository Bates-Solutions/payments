[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / GiftCardState

# Type Alias: GiftCardState

> **GiftCardState** = `"PENDING"` \| `"ACTIVE"` \| `"DEACTIVATED"` \| `"BLOCKED"` \| `"UNLINKED_OWNER"`

Defined in: [core/services/gift-cards.service.ts:25](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/gift-cards.service.ts#L25)

Lifecycle state of a gift card.

New cards start in `PENDING` and require an `ACTIVATE` activity before they
can be redeemed.
