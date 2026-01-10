# Managing Customers

This guide covers how to create and manage customers using the Square API with `@bates-solutions/squareup`.

## Prerequisites

- Square account with API credentials
- `@bates-solutions/squareup` installed
- Access token from Square Developer Dashboard

## Setup

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
});
```

## Creating Customers

```typescript
const customer = await square.customers.create({
  givenName: 'John',
  familyName: 'Doe',
  emailAddress: 'john@example.com',
  phoneNumber: '+15551234567',
});

console.log('Customer ID:', customer.id);
```

### Full Customer Details

```typescript
const customer = await square.customers.create({
  // Name
  givenName: 'John',
  familyName: 'Doe',

  // Contact info
  emailAddress: 'john@example.com',
  phoneNumber: '+15551234567',

  // Business info
  companyName: 'ACME Corp',
  nickname: 'Johnny',

  // Notes and reference
  note: 'VIP customer',
  referenceId: 'my-system-id-123',

  // Address
  address: {
    addressLine1: '123 Main Street',
    addressLine2: 'Suite 400',
    locality: 'San Francisco',
    administrativeDistrictLevel1: 'CA',
    postalCode: '94102',
    country: 'US',
  },
});
```

### Required Fields

At least one of these fields is required:
- `givenName`
- `familyName`
- `emailAddress`
- `phoneNumber`
- `companyName`

## Getting Customer Details

```typescript
const customer = await square.customers.get('CUST_123');

console.log('Name:', customer.givenName, customer.familyName);
console.log('Email:', customer.emailAddress);
console.log('Phone:', customer.phoneNumber);
console.log('Created:', customer.createdAt);
```

## Updating Customers

```typescript
const updated = await square.customers.update('CUST_123', {
  emailAddress: 'newemail@example.com',
  note: 'Updated customer note',
});

console.log('Updated:', updated.updatedAt);
```

### Update Address

```typescript
const updated = await square.customers.update('CUST_123', {
  address: {
    addressLine1: '456 New Street',
    locality: 'Los Angeles',
    administrativeDistrictLevel1: 'CA',
    postalCode: '90001',
    country: 'US',
  },
});
```

## Deleting Customers

```typescript
await square.customers.delete('CUST_123');
```

## Searching Customers

### By Email

```typescript
const { data: customers } = await square.customers.search({
  emailAddress: 'john@example.com',
});

if (customers.length > 0) {
  console.log('Found customer:', customers[0].id);
}
```

### By Phone Number

```typescript
const { data: customers } = await square.customers.search({
  phoneNumber: '+15551234567',
});
```

### By Reference ID

```typescript
const { data: customers } = await square.customers.search({
  referenceId: 'my-system-id-123',
});
```

### With Pagination

```typescript
let cursor: string | undefined;
const allCustomers: Customer[] = [];

do {
  const { data, cursor: nextCursor } = await square.customers.search({
    limit: 100,
    cursor,
  });

  allCustomers.push(...data);
  cursor = nextCursor;
} while (cursor);

console.log('Total customers:', allCustomers.length);
```

## Listing All Customers

```typescript
// Get first 50 customers
const customers = await square.customers.list({ limit: 50 });

for (const customer of customers) {
  console.log(customer.id, customer.emailAddress);
}
```

## Find or Create Pattern

A common pattern is to find an existing customer or create a new one:

```typescript
async function findOrCreateCustomer(email: string, name?: string) {
  // Try to find existing customer
  const { data: existing } = await square.customers.search({
    emailAddress: email,
  });

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new customer
  return square.customers.create({
    emailAddress: email,
    givenName: name,
  });
}

// Usage
const customer = await findOrCreateCustomer('john@example.com', 'John');
```

## Using Customers with Payments

Associate customers with payments for better tracking:

```typescript
// Create or find customer
const customer = await findOrCreateCustomer(email);

// Create payment associated with customer
const payment = await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000,
  customerId: customer.id,
});
```

## Using Customers with Orders

```typescript
const order = await square.orders
  .builder()
  .addItem({ name: 'Product', amount: 2500 })
  .withCustomer(customer.id!)
  .build();
```

## Storing Cards on File

Save a card for future payments (requires additional Square setup):

```typescript
// 1. Create the customer
const customer = await square.customers.create({
  emailAddress: 'john@example.com',
  givenName: 'John',
});

// 2. Create a card on file using the raw SDK
const card = await square.sdk.cards.create({
  idempotencyKey: crypto.randomUUID(),
  sourceId: 'cnon:card-nonce-ok',
  card: {
    customerId: customer.id,
    billingAddress: {
      addressLine1: '123 Main St',
      postalCode: '94102',
    },
  },
});

// 3. Later, charge the saved card
const payment = await square.payments.create({
  sourceId: card.card!.id!,
  amount: 1000,
  customerId: customer.id,
});
```

## Customer Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique customer ID |
| `givenName` | `string` | First name |
| `familyName` | `string` | Last name |
| `emailAddress` | `string` | Email address |
| `phoneNumber` | `string` | Phone number (E.164 format) |
| `companyName` | `string` | Company name |
| `nickname` | `string` | Nickname or alias |
| `note` | `string` | Internal notes |
| `referenceId` | `string` | Your external ID |
| `address` | `object` | Full address details |
| `createdAt` | `string` | Creation timestamp |
| `updatedAt` | `string` | Last update timestamp |

## Error Handling

```typescript
import {
  SquareValidationError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  const customer = await square.customers.create({
    // Missing required fields
  });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof SquareApiError) {
    if (error.code === 'CONFLICT') {
      console.error('Customer already exists');
    } else {
      console.error('API error:', error.errors);
    }
  }
}
```

## Best Practices

1. **Use email for lookups** - Email is the most reliable customer identifier
2. **Store reference IDs** - Link to your internal customer system
3. **E.164 phone format** - Use international format: `+15551234567`
4. **Handle duplicates** - Search before creating to avoid duplicates
5. **Keep notes updated** - Use the note field for customer context

## Next Steps

- [Payments Guide](./payments.md) - Process payments with customers
- [Orders Guide](./orders.md) - Create orders for customers
- [React Hooks](../react/hooks.md) - Customer management in React
