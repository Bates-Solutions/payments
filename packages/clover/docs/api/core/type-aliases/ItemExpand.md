[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / ItemExpand

# Type Alias: ItemExpand

> **ItemExpand** = `"tags"` \| `"categories"` \| `"taxRates"` \| `"modifierGroups"` \| `"itemStock"` \| `"options"` \| `"ageRestricted"` \| `string` & `object`

Defined in: [core/services/inventory.service.ts:18](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/inventory.service.ts#L18)

Related data Clover can embed in an item response (`expand`).

Any other string is also accepted so new Clover expansions work without a
library update.
