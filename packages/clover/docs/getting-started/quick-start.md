# Quick Start

## 1. Install

```bash
npm install @bates-solutions/clover
```

## 2. Create a client

```typescript
import { createCloverClient } from '@bates-solutions/clover';

const clover = createCloverClient({
  apiToken: process.env.CLOVER_API_TOKEN!,
  merchantId: process.env.CLOVER_MERCHANT_ID,
  environment: 'sandbox',
});
```

## 3. Charge a card

Amounts are in cents; `source` is a Clover card token (`clv_…`) produced client-side.

```typescript
const charge = await clover.payments.create({
  amount: 1000, // $10.00
  currency: 'usd',
  source: 'clv_1TSTStok...',
});

console.log(charge.paid); // true
```

## 4. Handle a decline

Declines throw a typed `CloverPaymentError`.

```typescript
import { CloverPaymentError } from '@bates-solutions/clover';

try {
  await clover.payments.create({ amount: 1000, source: 'clv_declined' });
} catch (error) {
  if (error instanceof CloverPaymentError) {
    console.error(error.code, error.declineCode);
  }
}
```

## 5. Receive webhooks

See the [Webhooks guide](../guides/server/webhooks.md).

## Next steps

- [Configuration](./configuration.md)
- [Payments guide](../guides/core/payments.md)
- [Customers guide](../guides/core/customers.md)
