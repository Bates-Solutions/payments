# Customers

The `customers` service wraps Stripe [Customers](https://docs.stripe.com/api/customers).

## Create a customer

At least one of `email`, `name`, or `phone` is required.

```typescript
const customer = await stripe.customers.create({
  email: 'john@example.com',
  name: 'John Doe',
  phone: '+15551234567',
  address: {
    line1: '1 Main St',
    city: 'Springfield',
    postalCode: '90210',
    country: 'US',
  },
});
```

## Retrieve and update

```typescript
const customer = await stripe.customers.get('cus_123');

const updated = await stripe.customers.update('cus_123', {
  email: 'new@example.com',
});
```

`get` throws a `StripeValidationError` if the customer has been deleted.

## Delete

```typescript
await stripe.customers.delete('cus_123');
```

## List

Cursor-based pagination, optionally filtered by exact email.

```typescript
const page1 = await stripe.customers.list({ limit: 50 });
const page2 = await stripe.customers.list({ startingAfter: page1.nextCursor });

const byEmail = await stripe.customers.list({ email: 'john@example.com' });
```

## Search

Uses Stripe's [search query language](https://docs.stripe.com/search#search-query-language).

```typescript
const { data } = await stripe.customers.search("email:'john@example.com'");

// Metadata search
const vip = await stripe.customers.search("metadata['tier']:'gold'");
```
