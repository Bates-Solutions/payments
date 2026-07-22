# Customers

The `customers` service wraps Clover's Platform [customers](https://docs.clover.com/dev/reference/customerscreatecustomer) API (`/v3/merchants/{mId}/customers`). It **requires a `merchantId`** on the client.

`email` and `phone` are conveniences that map to Clover's `emailAddresses` / `phoneNumbers` arrays.

## Create

```typescript
const customer = await clover.customers.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+15551234567',
});
```

At least one of `firstName`, `lastName`, `email`, or `phone` is required. If no `merchantId` is configured, a `CloverValidationError` is thrown.

## Retrieve, update, delete

```typescript
const customer = await clover.customers.get('CUS_123');

await clover.customers.update('CUS_123', { email: 'new@example.com' });

await clover.customers.delete('CUS_123');
```

## List

Offset-based pagination. The Clover `{ elements }` envelope is unwrapped to `data`.

```typescript
const { data } = await clover.customers.list({ limit: 50, offset: 0 });
```
