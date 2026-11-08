[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CreateChargeOptions

# Interface: CreateChargeOptions

Defined in: core/types/index.ts:44

Options for creating a charge (a payment).

## Properties

### amount

> **amount**: `number`

Defined in: core/types/index.ts:46

Amount in cents

***

### capture?

> `optional` **capture?**: `boolean`

Defined in: core/types/index.ts:56

Capture the charge immediately. Set `false` to authorize only (capture
later with `payments.capture`).

#### Default

```ts
true
```

***

### currency?

> `optional` **currency?**: [`CurrencyCode`](../type-aliases/CurrencyCode.md)

Defined in: core/types/index.ts:48

ISO currency code (default: `usd`)

***

### description?

> `optional` **description?**: `string`

Defined in: core/types/index.ts:58

Description shown on the charge

***

### externalReferenceId?

> `optional` **externalReferenceId?**: `string`

Defined in: core/types/index.ts:62

Your own reference id (invoice/PO number)

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: core/types/index.ts:64

Idempotency key (defaults to a generated UUID)

***

### receiptEmail?

> `optional` **receiptEmail?**: `string`

Defined in: core/types/index.ts:60

Email address to send the receipt to

***

### source

> **source**: `string`

Defined in: core/types/index.ts:50

Tokenized payment source (a `clv_…` token)
