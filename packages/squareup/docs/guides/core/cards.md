# Cards on File

`square.cards` stores a customer's card with Square so you can charge it later
without asking for the card details again: renewals, usage billing, one-click
checkout.

## Setup

```typescript
import { createIdempotencyKey, createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
  locationId: 'YOUR_LOCATION_ID',
});
```

## Storing a Card

Tokenize the card in the browser with the Web Payments SDK, then store the
token (`cnon:...`) for a customer. You can also pass the ID of a payment made
with the card.

```typescript
const card = await square.cards.create({
  // Required
  sourceId: 'cnon:card-nonce-ok',
  customerId: 'CUST_123',
  idempotencyKey: createIdempotencyKey(),

  // Optional
  cardholderName: 'Amelia Earhart',
  billingAddress: {
    addressLine1: '500 Electric Ave',
    locality: 'New York',
    administrativeDistrictLevel1: 'NY',
    postalCode: '10003',
    country: 'US',
  },
  referenceId: 'user-42', // Your own ID for the card
});

console.log(card.id, card.cardBrand, card.last4, card.expMonth, card.expYear);
```

`idempotencyKey` is required: Square stores the card once per key, so a retry
with the same key (after a timeout, say) cannot store it twice. A missing or
empty `sourceId`, `customerId` or `idempotencyKey` throws a
`SquareValidationError` naming the field. A card Square refuses to store (a
CVV or address failure, for example) throws a `SquarePaymentError`; see
[Declines](./payments.md#declines-retry-later-or-ask-for-another-card).

## Charging a Stored Card

Pass the card ID as the payment source, with the customer. For a charge the
buyer did not start, set `customerDetails.customerInitiated: false`.

```typescript
const payment = await square.payments.create({
  sourceId: card.id!,
  customerId: 'CUST_123',
  amount: 2500,
  customerDetails: { customerInitiated: false, sellerKeyedIn: false },
  idempotencyKey: 'renewal-SUB_123-2026-12',
});
```

A subscription bills a stored card when you pass its ID as `cardId` to
`subscriptions.create()` or `subscriptions.update()`.

## Getting a Card

```typescript
const card = await square.cards.get('ccof:CARD_123');
```

## Listing Cards

`list` returns one page and the cursor of the next one (`undefined` on the last
page). By default it returns every enabled card of the merchant.

```typescript
let cursor: string | undefined;
do {
  const page = await square.cards.list({
    customerId: 'CUST_123', // Only this customer's cards
    includeDisabled: false, // Default: false
    cursor,
  });
  for (const card of page.cards) {
    console.log(card.id, card.last4, card.enabled);
  }
  cursor = page.cursor;
} while (cursor);
```

## Disabling a Card

A disabled card cannot be charged, and cannot be enabled again; store the card
again to use it.

```typescript
const disabled = await square.cards.disable('ccof:CARD_123');
// disabled.enabled === false
```

## Next Steps

- [Processing Payments](./payments.md) - Charge the stored card, handle declines
- [Subscriptions](./subscriptions.md) - Bill a stored card on a schedule
- [Refunds](./refunds.md) - Refund a payment
