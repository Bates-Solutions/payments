[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateInvoiceOptions

# Interface: CreateInvoiceOptions

Defined in: [core/services/invoices.service.ts:26](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L26)

Options for creating an invoice.

## Properties

### autoAdvance?

> `optional` **autoAdvance?**: `boolean`

Defined in: [core/services/invoices.service.ts:34](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L34)

Let Stripe automatically finalize and (for `charge_automatically`) pay the
invoice. Leave `false` to keep it a draft you finalize yourself.

#### Default

```ts
false
```

***

### collectionMethod?

> `optional` **collectionMethod?**: `CollectionMethod`

Defined in: [core/services/invoices.service.ts:39](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L39)

How the invoice is collected.

#### Default

```ts
'charge_automatically'
```

***

### customerId

> **customerId**: `string`

Defined in: [core/services/invoices.service.ts:28](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L28)

Customer the invoice is billed to

***

### daysUntilDue?

> `optional` **daysUntilDue?**: `number`

Defined in: [core/services/invoices.service.ts:41](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L41)

Days until due — only valid with `collectionMethod: 'send_invoice'`

***

### description?

> `optional` **description?**: `string`

Defined in: [core/services/invoices.service.ts:43](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L43)

Arbitrary description shown on the invoice

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/invoices.service.ts:49](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L49)

Idempotency key (defaults to a generated UUID)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/invoices.service.ts:47](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L47)

Key/value metadata attached to the invoice

***

### subscriptionId?

> `optional` **subscriptionId?**: `string`

Defined in: [core/services/invoices.service.ts:45](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L45)

Attach the invoice to an existing subscription
