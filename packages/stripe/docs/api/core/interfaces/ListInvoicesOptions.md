[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListInvoicesOptions

# Interface: ListInvoicesOptions

Defined in: [core/services/invoices.service.ts:85](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L85)

Options for listing invoices.

## Properties

### created?

> `optional` **created?**: [`TimeRange`](TimeRange.md)

Defined in: [core/services/invoices.service.ts:91](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L91)

Only invoices created in this time range

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/services/invoices.service.ts:86](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L86)

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/invoices.service.ts:92](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L92)

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/services/invoices.service.ts:93](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L93)

***

### status?

> `optional` **status?**: `Status`

Defined in: [core/services/invoices.service.ts:89](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L89)

Only invoices in this status. Use `'paid'` for completed sales.

***

### subscriptionId?

> `optional` **subscriptionId?**: `string`

Defined in: [core/services/invoices.service.ts:87](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L87)
