# Quick Start

Get from zero to a processed payment in a few minutes.

## 1. Install

```bash
npm install @bates-solutions/stripe stripe
```

## 2. Create a client

Grab your secret key from the [Stripe dashboard](https://dashboard.stripe.com/apikeys). A `sk_test_…` key operates in test mode; `sk_live_…` in live mode.

```typescript
import { createStripeClient } from '@bates-solutions/stripe';

const stripe = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

stripe.environment; // 'test' or 'live', derived from the key
```

## 3. Create a payment

Amounts are in the smallest currency unit (e.g. cents).

```typescript
const payment = await stripe.payments.create({
  amount: 1000, // $10.00
  currency: 'usd',
  paymentMethod: 'pm_card_visa',
  confirm: true,
});

console.log(payment.status); // 'succeeded'
```

## 4. Handle a card decline

Failed payments throw a typed `StripePaymentError`.

```typescript
import { StripePaymentError } from '@bates-solutions/stripe';

try {
  await stripe.payments.create({ amount: 1000, paymentMethod: 'pm_card_chargeDeclined', confirm: true });
} catch (error) {
  if (error instanceof StripePaymentError) {
    console.error(error.code, error.declineCode);
  }
}
```

## 5. Receive webhooks

See the [Webhooks guide](../guides/server/webhooks.md) to verify and process events.

## Next steps

- [Configuration](./configuration.md)
- [Payments guide](../guides/core/payments.md)
- [Customers guide](../guides/core/customers.md)
- [Refunds guide](../guides/core/refunds.md)
