# Billing Portal

The `billingPortal` service wraps Stripe's [Customer Billing Portal](https://docs.stripe.com/api/customer_portal/sessions) — the hosted page where customers manage their subscription and payment methods.

## Create a portal session

```typescript
const session = await stripe.billingPortal.create({
  customerId: 'cus_123',
  returnUrl: 'https://app.example.com/account',
});

redirect(session.url);
```

Options:

| Field           | Type     | Description                                              |
| --------------- | -------- | ------------------------------------------------------- |
| `customerId`    | `string` | **Required.** Customer to open the portal for.          |
| `returnUrl`     | `string` | Where to send the customer when they leave the portal.  |
| `configuration` | `string` | A specific portal configuration ID to use.              |

A missing `customerId` throws a `StripeValidationError`.
