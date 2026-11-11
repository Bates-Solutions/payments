[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / AddInvoiceItemOptions

# Interface: AddInvoiceItemOptions

Defined in: [core/services/invoices.service.ts:58](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L58)

Options for adding an invoice item.

Provide either `amount` (+ `currency`) for an ad-hoc charge, or `priceId` to
bill an existing Price.

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: [core/services/invoices.service.ts:62](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L62)

Amount in the smallest currency unit (e.g. cents). Mutually exclusive with `priceId`.

***

### currency?

> `optional` **currency?**: `string`

Defined in: [core/services/invoices.service.ts:64](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L64)

ISO currency code (required with `amount`)

***

### customerId

> **customerId**: `string`

Defined in: [core/services/invoices.service.ts:60](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L60)

Customer the item is billed to

***

### description?

> `optional` **description?**: `string`

Defined in: [core/services/invoices.service.ts:75](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L75)

Arbitrary description shown on the line item

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/invoices.service.ts:79](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L79)

Idempotency key (defaults to a generated UUID)

***

### invoiceId?

> `optional` **invoiceId?**: `string`

Defined in: [core/services/invoices.service.ts:73](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L73)

Attach to a specific draft invoice. When omitted, the item is pending and
is drawn onto the customer's next invoice.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/invoices.service.ts:77](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L77)

Key/value metadata attached to the invoice item

***

### priceId?

> `optional` **priceId?**: `string`

Defined in: [core/services/invoices.service.ts:66](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L66)

Existing Price to bill. Mutually exclusive with `amount`.

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/services/invoices.service.ts:68](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/invoices.service.ts#L68)

Quantity (used with `priceId`)
