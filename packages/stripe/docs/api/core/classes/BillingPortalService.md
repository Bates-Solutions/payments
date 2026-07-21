[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / BillingPortalService

# Class: BillingPortalService

Defined in: core/services/billing-portal.service.ts:38

Billing Portal service wrapping Stripe
[Billing Portal Sessions](https://docs.stripe.com/api/customer_portal/sessions).

## Example

```typescript
const session = await stripe.billingPortal.create({
  customerId: 'cus_123',
  returnUrl: 'https://app.example.com/account',
});

redirect(session.url);
```

## Constructors

### Constructor

> **new BillingPortalService**(`client`): `BillingPortalService`

Defined in: core/services/billing-portal.service.ts:39

#### Parameters

##### client

`Stripe`

#### Returns

`BillingPortalService`

## Methods

### create()

> **create**(`options`): `Promise`\<`Session`\>

Defined in: core/services/billing-portal.service.ts:49

Create a Billing Portal session for a customer.

#### Parameters

##### options

[`CreatePortalSessionOptions`](../interfaces/CreatePortalSessionOptions.md)

Session creation options

#### Returns

`Promise`\<`Session`\>

The created session (use `session.url` to redirect the customer)

#### Throws

When `customerId` is missing
