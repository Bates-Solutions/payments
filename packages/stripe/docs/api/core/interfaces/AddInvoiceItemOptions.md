[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / AddInvoiceItemOptions

# Interface: AddInvoiceItemOptions

Defined in: [core/services/invoices.service.ts:52](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L52)

Options for adding an invoice item.

Provide either `amount` (+ `currency`) for an ad-hoc charge, or `priceId` to
bill an existing Price.

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: [core/services/invoices.service.ts:56](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L56)

Amount in the smallest currency unit (e.g. cents). Mutually exclusive with `priceId`.

***

### currency?

> `optional` **currency?**: `string`

Defined in: [core/services/invoices.service.ts:58](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L58)

ISO currency code (required with `amount`)

***

### customerId

> **customerId**: `string`

Defined in: [core/services/invoices.service.ts:54](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L54)

Customer the item is billed to

***

### description?

> `optional` **description?**: `string`

Defined in: [core/services/invoices.service.ts:69](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L69)

Arbitrary description shown on the line item

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/invoices.service.ts:73](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L73)

Idempotency key (defaults to a generated UUID)

***

### invoiceId?

> `optional` **invoiceId?**: `string`

Defined in: [core/services/invoices.service.ts:67](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L67)

Attach to a specific draft invoice. When omitted, the item is pending and
is drawn onto the customer's next invoice.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/invoices.service.ts:71](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L71)

Key/value metadata attached to the invoice item

***

### priceId?

> `optional` **priceId?**: `string`

Defined in: [core/services/invoices.service.ts:60](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L60)

Existing Price to bill. Mutually exclusive with `amount`.

***

### quantity?

> `optional` **quantity?**: `number`

Defined in: [core/services/invoices.service.ts:62](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L62)

Quantity (used with `priceId`)
