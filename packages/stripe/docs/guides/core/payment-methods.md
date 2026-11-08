# Payment Methods & SetupIntents

`setupIntents` saves a payment method for later without charging it, and `paymentMethods` manages what's saved. Together they are the Stripe equivalent of Square's card on file.

## Save a card for later

1. Create a SetupIntent on the server.
2. Pass its `client_secret` to Stripe.js, which collects and confirms the card (including any 3D Secure step).
3. When it succeeds, Stripe attaches the payment method to the customer. Listen for `setup_intent.succeeded` or check the SetupIntent.

```typescript
const intent = await stripe.setupIntents.create({
  customerId: 'cus_123',
  metadata: { reason: 'card-on-file' },
});
return { clientSecret: intent.client_secret };
```

| Option               | Type                            | Description                                                       |
| -------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `customerId`         | `string`                        | Customer the saved payment method is attached to.                 |
| `usage`              | `'off_session' \| 'on_session'` | Defaults to `off_session` (charging when the customer is absent). |
| `paymentMethodTypes` | `string[]`                      | e.g. `['card']`. Omit to use the types enabled in your Dashboard. |
| `paymentMethod`      | `string`                        | An existing payment method to set up.                             |
| `confirm`            | `boolean`                       | Confirm now on the server. Requires `paymentMethod`.              |
| `returnUrl`          | `string`                        | Where to return after a redirect-based authentication.            |
| `metadata`           | `Record<string, string>`        | Your own key/value data.                                          |

Other SetupIntent calls:

```typescript
await stripe.setupIntents.get('seti_123');
await stripe.setupIntents.confirm('seti_123', { paymentMethod: 'pm_123' });
await stripe.setupIntents.cancel('seti_123', { reason: 'abandoned' });
const { data } = await stripe.setupIntents.list({ customerId: 'cus_123' });
```

## Manage saved payment methods

```typescript
// A customer's saved cards (cursor-paginated)
const { data: cards, nextCursor } = await stripe.paymentMethods.list({
  customerId: 'cus_123',
  type: 'card',
});

// Make one the default for invoices and subscriptions
await stripe.paymentMethods.setDefault('cus_123', cards[0].id);

// Remove one
await stripe.paymentMethods.detach('pm_123');

// Attach one directly (prefer a SetupIntent for off-session use)
await stripe.paymentMethods.attach('pm_456', { customerId: 'cus_123' });
```

`setDefault` sets `invoice_settings.default_payment_method` on the customer and returns the updated customer. The payment method must already be attached.

Attaching directly skips the authentication and mandate a SetupIntent collects, so off-session charges on it are more likely to need the customer back. Use a SetupIntent when you'll charge the card later.

## Charge a saved card

```typescript
await stripe.payments.create({
  amount: 4900,
  currency: 'usd',
  customerId: 'cus_123',
  paymentMethod: 'pm_123',
  confirm: true,
});
```

If the bank asks for authentication, this throws a `StripePaymentError`. Bring the customer back on-session to finish (for example, confirm a PaymentIntent with Stripe.js).
