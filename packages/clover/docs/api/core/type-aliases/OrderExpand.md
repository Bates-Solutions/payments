[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / OrderExpand

# Type Alias: OrderExpand

> **OrderExpand** = `"lineItems"` \| `"lineItems.discounts"` \| `"lineItems.modifications"` \| `"payments"` \| `"payment.tender"` \| `"payment.cardTransaction"` \| `"refunds"` \| `"credits"` \| `"voids"` \| `"employee"` \| `"customers"` \| `"discounts"` \| `"serviceCharge"` \| `"orderType"` \| `string` & `object`

Defined in: [core/services/orders.service.ts:11](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L11)

Related data Clover can embed in an order response (`expand`).

Any other string is also accepted so new Clover expansions work without a
library update.
