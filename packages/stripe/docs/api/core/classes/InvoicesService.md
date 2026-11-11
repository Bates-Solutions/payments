[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / InvoicesService

# Class: InvoicesService

Defined in: [core/services/invoices.service.ts:102](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L102)

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

Defined in: [core/services/invoices.service.ts:103](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L103)

#### Parameters

##### client

`Stripe`

#### Returns

`InvoicesService`

## Methods

### addItem()

> **addItem**(`options`): `Promise`\<`InvoiceItem`\>

Defined in: [core/services/invoices.service.ts:140](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L140)

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

Defined in: [core/services/invoices.service.ts:110](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L110)

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

Defined in: [core/services/invoices.service.ts:212](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L212)

Finalize a draft invoice so it becomes payable.

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>

***

### get()

> **get**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:178](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L178)

Retrieve an invoice by ID.

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Invoice`\>\>

Defined in: [core/services/invoices.service.ts:189](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L189)

List invoices with cursor-based pagination.

#### Parameters

##### options?

[`ListInvoicesOptions`](../interfaces/ListInvoicesOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Invoice`\>\>

***

### pay()

> **pay**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:223](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L223)

Pay a finalized invoice.

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>

***

### send()

> **send**(`invoiceId`): `Promise`\<`Invoice`\>

Defined in: [core/services/invoices.service.ts:246](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L246)

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

Defined in: [core/services/invoices.service.ts:234](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/core/services/invoices.service.ts#L234)

Void a finalized invoice (it can no longer be paid).

#### Parameters

##### invoiceId

`string`

#### Returns

`Promise`\<`Invoice`\>
