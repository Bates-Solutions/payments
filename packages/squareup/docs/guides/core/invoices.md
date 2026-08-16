# Invoices

The `invoices` service creates and manages Square invoices. Under the hood, `create()` first builds an order from your line items, then creates a DRAFT invoice against it.

## Create an invoice

```typescript
const invoice = await square.invoices.create({
  customerId: 'CUST_123',
  lineItems: [
    { name: 'Web Development', quantity: 10, amount: 10000 }, // $100.00 each
  ],
  title: 'March Invoice',
  dueDate: '2026-04-30',
});
```

Key options:

| Field                    | Type                            | Description                                                       |
| ------------------------ | ------------------------------- | ---------------------------------------------------------------- |
| `customerId`             | `string`                        | **Required.** Customer to bill.                                  |
| `lineItems`              | `InvoiceLineItem[]`             | **Required.** At least one. Custom line items carry a `currency` (defaults to the client's [`defaultCurrency`](../../getting-started/configuration.md)). |
| `dueDate`                | `string`                        | `YYYY-MM-DD`.                                                    |
| `acceptedPaymentMethods` | `AcceptedPaymentMethodsInput`   | Payment methods on the hosted payment page. **Defaults to `{ card: true }`** — see below. |
| `tippingEnabled`         | `boolean`                       | Enable tipping. Default `false`.                                |

### Accepted payment methods

Square **requires** `accepted_payment_methods` on every invoice — omitting it makes the API reject the request. This wrapper defaults it to `{ card: true }`, so `create()` works out of the box. Override to enable more:

```typescript
await square.invoices.create({
  customerId: 'CUST_123',
  lineItems: [{ name: 'Item', quantity: 1, amount: 5000 }],
  acceptedPaymentMethods: {
    card: true,
    squareGiftCard: true,
    bankAccount: true,
    buyNowPayLater: true,
    cashAppPay: true, // US locations only
  },
});
```

## Update an invoice

```typescript
const updated = await square.invoices.update('INV_123', 0 /* version */, {
  title: 'Updated title',
  acceptedPaymentMethods: { card: true, cashAppPay: true },
});
```

`acceptedPaymentMethods` is sent **only when you pass it**, so an unrelated update won't overwrite the invoice's existing methods. Updates generally apply to DRAFT invoices.

## Publish, cancel, delete

```typescript
await square.invoices.publish('INV_123', 0);
await square.invoices.cancel('INV_123', 1);
await square.invoices.delete('INV_123', 0); // DRAFT only
```
