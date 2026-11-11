[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / InvoicesService

# Class: InvoicesService

Defined in: [core/services/invoices.service.ts:111](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L111)

Invoices service wrapping Stripe [Invoices](https://docs.stripe.com/api/invoices)
and [Invoice Items](https://docs.stripe.com/api/invoiceitems).

A typical flow: add items, create a draft invoice, finalize it, then either
let Stripe charge it automatically or `send` it for manual payment.

## Example

```typescript
await stripe.invoices.addItem({ customerId: 'cus_1', amount: 4900, currency: 'usd' });
const draft = await stripe.invoices.create({ customerId: 'cus_1' });
const finalized = await stripe.invoices.finalize(draft.id);
await stripe.invoices.send(finalized.id);
```

## Constructors

### Constructor

> **new InvoicesService**(`client`): `InvoicesService`

Defined in: [core/services/invoices.service.ts:112](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L112)

#### Parameters

##### client

`Stripe`

#### Returns

`InvoicesService`

## Methods

### addItem()

> **addItem**(`options`): `Promise`\<`InvoiceItem`\>

Defined in: [core/services/invoices.service.ts:149](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L149)

Add an invoice item — either to a specific draft invoice or pending on the
customer's next invoice.

#### Parameters

##### options

[`AddInvoiceItemOptions`](../interfaces/AddInvoiceItemOptions.md)

#### Returns

`Promise`\<`InvoiceItem`\>

#### Throws

When `customerId` is missing, or neither
`amount` nor `priceId` is provided

***

### create()

> **create**(`options`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:119](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L119)

Create an invoice (a draft by default).

#### Parameters

##### options

[`CreateInvoiceOptions`](../interfaces/CreateInvoiceOptions.md)

#### Returns

`Promise`\<`Invoice`\>

#### Throws

When `customerId` is missing

***

### finalize()

> **finalize**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:251](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L251)

Finalize a draft invoice so it becomes payable.

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>

***

### get()

> **get**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:187](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L187)

Retrieve an invoice by ID.

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Invoice`\>\>

Defined in: [core/services/invoices.service.ts:198](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L198)

List invoices with cursor-based pagination.

#### Parameters

##### options?

[`ListInvoicesOptions`](../interfaces/ListInvoicesOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Invoice`\>\>

***

### listLines()

> **listLines**(`invoiceId`): `Promise`\<`InvoiceLineItem`[]\>

Defined in: [core/services/invoices.service.ts:232](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L232)

List all lines of an invoice (every page, fetched for you).

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`InvoiceLineItem`[]\>

#### Throws

When `invoiceId` is missing

#### Example

```typescript
const { data: paid } = await stripe.invoices.list({ status: 'paid', created: { gte: since } });
for (const invoice of paid) {
  const lines = await stripe.invoices.listLines(invoice.id);
}
```

***

### pay()

> **pay**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:262](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L262)

Pay a finalized invoice.

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>

***

### send()

> **send**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:285](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L285)

Send an invoice to the customer for manual payment (`send_invoice`
collection). Emails a hosted invoice link.

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>

***

### voidInvoice()

> **voidInvoice**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:273](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/invoices.service.ts#L273)

Void a finalized invoice (it can no longer be paid).

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>
