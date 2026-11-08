# Managing Checkout & Payment Links

This guide covers how to create and manage payment links using the Square Checkout API with `@bates-solutions/squareup`.

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

## Creating Payment Links

Payment links allow customers to pay through a Square-hosted checkout page.

### Quick Pay (Simple)

For single-item purchases:

```typescript
const link = await square.checkout.paymentLinks.create({
  quickPay: {
    name: 'Auto Detailing Service',
    priceMoney: { amount: BigInt(5000), currency: 'USD' }, // $50.00
    locationId: 'YOUR_LOCATION_ID',
  },
});

console.log('Checkout URL:', link.url);
console.log('Payment Link ID:', link.id);
```

### With Order (Multiple Items)

For carts with multiple items:

```typescript
const link = await square.checkout.paymentLinks.create({
  order: {
    locationId: 'YOUR_LOCATION_ID',
    lineItems: [
      {
        name: 'Product A',
        quantity: '2',
        basePriceMoney: { amount: BigInt(1500), currency: 'USD' },
      },
      {
        name: 'Product B',
        quantity: '1',
        basePriceMoney: { amount: BigInt(2500), currency: 'USD' },
      },
    ],
  },
});
```

### With Checkout Options

Customize the checkout experience:

```typescript
const link = await square.checkout.paymentLinks.create({
  quickPay: {
    name: 'Premium Service',
    priceMoney: { amount: BigInt(10000), currency: 'USD' },
    locationId: 'YOUR_LOCATION_ID',
  },
  checkoutOptions: {
    allowTipping: true,
    askForShippingAddress: true,
    redirectUrl: 'https://example.com/thank-you',
    merchantSupportEmail: 'support@example.com',
    acceptedPaymentMethods: {
      applePay: true,
      googlePay: true,
      cashAppPay: true,
    },
    enableCoupon: true,
    enableLoyalty: true,
  },
});
```

### With Pre-populated Data

Pre-fill customer information:

```typescript
const link = await square.checkout.paymentLinks.create({
  quickPay: {
    name: 'Subscription',
    priceMoney: { amount: BigInt(2999), currency: 'USD' },
    locationId: 'YOUR_LOCATION_ID',
  },
  prePopulatedData: {
    buyerEmail: 'customer@example.com',
    buyerPhoneNumber: '+15555555555',
    buyerAddress: {
      addressLine1: '123 Main St',
      locality: 'San Francisco',
      administrativeDistrictLevel1: 'CA',
      postalCode: '94102',
      country: 'US',
    },
  },
});
```

## Getting Payment Link Details

```typescript
const link = await square.checkout.paymentLinks.get('LINK_123');

console.log('URL:', link.url);
console.log('Order ID:', link.orderId);
console.log('Created:', link.createdAt);
```

## Updating Payment Links

```typescript
// Get the current link first (need version)
const currentLink = await square.checkout.paymentLinks.get('LINK_123');

// Update with new options
const updatedLink = await square.checkout.paymentLinks.update('LINK_123', {
  paymentLink: {
    version: currentLink.version!, // Required for concurrency
    description: 'Updated description',
    checkoutOptions: {
      askForShippingAddress: false,
      redirectUrl: 'https://example.com/new-confirmation',
    },
  },
});
```

## Listing Payment Links

```typescript
// List all payment links
const { data: links } = await square.checkout.paymentLinks.list();

for (const link of links) {
  console.log(link.id, link.url, link.createdAt);
}

// List with limit
const { data: recentLinks } = await square.checkout.paymentLinks.list({
  limit: 10,
});
```

## Deleting Payment Links

```typescript
await square.checkout.paymentLinks.delete('LINK_123');
```

## Checkout Options Reference

| Option | Description |
|--------|-------------|
| `allowTipping` | Allow customers to add a tip |
| `askForShippingAddress` | Collect shipping address |
| `redirectUrl` | URL to redirect after payment |
| `merchantSupportEmail` | Support email shown to customers |
| `acceptedPaymentMethods` | Enable Apple Pay, Google Pay, etc. |
| `enableCoupon` | Allow coupon/promo codes |
| `enableLoyalty` | Allow loyalty rewards redemption |
| `appFeeMoney` | Application fee to collect |
| `shippingFee` | Add shipping charge |

## Complete Example

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

async function createCheckoutLink(
  productName: string,
  priceInCents: number,
  customerEmail?: string
) {
  const square = createSquareClient({
    accessToken: process.env.SQUARE_ACCESS_TOKEN!,
    environment: 'production',
  });

  const link = await square.checkout.paymentLinks.create({
    quickPay: {
      name: productName,
      priceMoney: { amount: BigInt(priceInCents), currency: 'USD' },
      locationId: process.env.SQUARE_LOCATION_ID!,
    },
    checkoutOptions: {
      redirectUrl: `${process.env.APP_URL}/checkout/success`,
      askForShippingAddress: true,
      acceptedPaymentMethods: {
        applePay: true,
        googlePay: true,
      },
    },
    prePopulatedData: customerEmail
      ? { buyerEmail: customerEmail }
      : undefined,
  });

  return {
    linkId: link.id,
    checkoutUrl: link.url,
    orderId: link.orderId,
  };
}

// Usage
const checkout = await createCheckoutLink('Premium Plan', 9900, 'user@example.com');
console.log('Send this link to customer:', checkout.checkoutUrl);
```

## Error Handling

```typescript
import {
  SquareValidationError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  const link = await square.checkout.paymentLinks.create({
    // Missing required fields
  });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  } else if (error instanceof SquareApiError) {
    console.error('API error:', error.statusCode);
    console.error('Details:', error.errors);
  }
}
```

## Best Practices

1. **Use quick pay** for simple single-item purchases
2. **Use orders** when you have multiple line items or need order tracking
3. **Set redirect URLs** to control the post-payment experience
4. **Pre-populate data** when you already have customer information
5. **Enable multiple payment methods** for better conversion
6. **Use idempotency keys** for retries to prevent duplicate links

## Next Steps

- [Orders Guide](./orders.md) - Create orders programmatically
- [Payments Guide](./payments.md) - Process payments directly
- [Webhooks Guide](../server/webhooks.md) - Listen for payment events
