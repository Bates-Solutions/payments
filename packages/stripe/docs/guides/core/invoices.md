# Invoices

The `invoices` service wraps Stripe [Invoices](https://docs.stripe.com/api/invoices) and [Invoice Items](https://docs.stripe.com/api/invoiceitems) — one-off and subscription billing documents you can build, finalize, and collect.

## Typical flow

```typescript
// 1. Add one or more line items for the customer
await stripe.invoices.addItem({
  customerId: 'cus_123',
  amount: 4900, // $49.00 in cents
  currency: 'usd',
  description: 'Professional plan — July',
});

// 2. Draft the invoice
const draft = await stripe.invoices.create({
  customerId: 'cus_123',
  collectionMethod: 'send_invoice',
  daysUntilDue: 30,
});

// 3. Finalize it so it becomes payable
const finalized = await stripe.invoices.finalize(draft.id);

// 4. Email the customer a hosted invoice link (send_invoice collection)
await stripe.invoices.send(finalized.id);
```

For automatically-charged invoices, use the default `collectionMethod: 'charge_automatically'` and either set `autoAdvance: true` (let Stripe finalize + charge) or call `finalize` then `pay` yourself.

## Create an invoice

```typescript
const invoice = await stripe.invoices.create({ customerId: 'cus_123' });
```

Options:

| Field              | Type                                        | Description                                                     |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------- |
| `customerId`       | `string`                                    | **Required.** Customer billed.                                  |
| `autoAdvance`      | `boolean`                                   | Let Stripe finalize/charge automatically. Defaults to `false`.  |
| `collectionMethod` | `'charge_automatically' \| 'send_invoice'`  | Defaults to `charge_automatically`.                             |
| `daysUntilDue`     | `number`                                    | Only valid with `send_invoice`.                                 |
| `description`      | `string`                                    | Shown on the invoice.                                           |
| `subscriptionId`   | `string`                                    | Attach the invoice to a subscription.                           |
| `metadata`         | `Record<string, string>`                    | Arbitrary metadata.                                             |
| `idempotencyKey`   | `string`                                    | Defaults to a generated UUID.                                   |

Missing `customerId` throws a `StripeValidationError`.

## Add an invoice item

Provide either an ad-hoc `amount` (+ `currency`) or an existing `priceId`:

```typescript
// Ad-hoc amount, attached to a specific draft invoice
await stripe.invoices.addItem({
  customerId: 'cus_123',
  amount: 800,
  currency: 'usd',
  invoiceId: 'in_123',
  description: 'Additional active client',
});

// Existing price, pending on the customer's next invoice
await stripe.invoices.addItem({ customerId: 'cus_123', priceId: 'price_123', quantity: 2 });
```

Omitting both `amount` and `priceId`, or passing `amount` without `currency`, throws a `StripeValidationError`. When `invoiceId` is omitted the item is pending and is drawn onto the customer's next invoice.

## Retrieve and list

```typescript
const invoice = await stripe.invoices.get('in_123');

const { data, hasMore, nextCursor } = await stripe.invoices.list({
  customerId: 'cus_123',
  status: 'open', // 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  limit: 20,
});

// Next page
const next = await stripe.invoices.list({ customerId: 'cus_123', startingAfter: nextCursor });
```

## Lifecycle actions

```typescript
await stripe.invoices.finalize('in_123');    // draft → open (payable)
await stripe.invoices.pay('in_123');         // charge a finalized invoice
await stripe.invoices.voidInvoice('in_123'); // finalized invoice → void (unpayable)
await stripe.invoices.send('in_123');        // email a hosted invoice link
```

## Webhooks

Extract the invoice ID from any webhook event that carries one (`invoice.*` events, or objects that reference an invoice):

```typescript
import { getInvoiceId } from '@bates-solutions/stripe/server';

const invoiceId = getInvoiceId(event);
```

Common invoice events: `invoice.paid`, `invoice.payment_failed`, `invoice.finalized`.
