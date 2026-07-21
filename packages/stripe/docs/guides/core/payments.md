# Payments

The `payments` service wraps Stripe [PaymentIntents](https://docs.stripe.com/api/payment_intents). Amounts are always in the smallest currency unit (e.g. cents).

## Create a payment

```typescript
const payment = await stripe.payments.create({
  amount: 1000, // $10.00
  currency: 'usd',
  paymentMethod: 'pm_card_visa',
  confirm: true,
});
```

Options:

| Field           | Type                     | Description                                        |
| --------------- | ------------------------ | -------------------------------------------------- |
| `amount`        | `number`                 | **Required.** Amount in the smallest currency unit. |
| `currency`      | `CurrencyCode`           | Defaults to `usd`.                                 |
| `customerId`    | `string`                 | Attach the payment to a customer.                  |
| `paymentMethod` | `string`                 | Payment method to charge (e.g. `pm_…`).            |
| `confirm`       | `boolean`                | Confirm immediately after creation. Default `false`. |
| `description`   | `string`                 | Description shown in the dashboard.                |
| `receiptEmail`  | `string`                 | Email to send the receipt to.                      |
| `metadata`      | `Record<string, string>` | Arbitrary key/value metadata.                      |
| `idempotencyKey`| `string`                 | Defaults to a generated UUID.                      |

## Retrieve, capture, and cancel

```typescript
const payment = await stripe.payments.get('pi_123');

// Capture a manually-captured (authorized) payment
await stripe.payments.capture('pi_123');

// Cancel a payment
await stripe.payments.cancel('pi_123');
```

## List payments

Cursor-based pagination — pass the previous page's `nextCursor` as `startingAfter`.

```typescript
const page1 = await stripe.payments.list({ limit: 20 });
const page2 = await stripe.payments.list({ startingAfter: page1.nextCursor });

for (const payment of page1.data) {
  console.log(payment.id, payment.status);
}
```

## Errors

Card declines throw a [`StripePaymentError`](../../getting-started/quick-start.md#4-handle-a-card-decline) with a normalized `code` and the Stripe `declineCode`. All other API failures throw a `StripeApiError`. See the [error handling reference](../../api/README.md).
