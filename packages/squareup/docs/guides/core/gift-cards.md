# Managing Gift Cards

This guide covers the full Square gift card lifecycle: issuance, activation, balance changes, redemption, customer linking, and deactivation.

## Prerequisites

- Square account with API credentials
- `@bates-solutions/squareup` installed
- A `locationId` configured on the client (gift cards are registered per location for reporting)

## Setup

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
  locationId: 'YOUR_LOCATION_ID',
});
```

## The Two Services

`square.giftCards` exposes two related services:

- **`square.giftCards`** — issuance, lookup, customer linking
- **`square.giftCards.activities`** — balance and lifecycle changes (ACTIVATE, LOAD, REDEEM, DEACTIVATE, etc.)

Convenience helpers on the top level (`activate`, `load`, `redeem`, `deactivate`) wrap the most common activity creates.

## Issuing a Gift Card

### Digital Card (Square-Generated GAN)

```typescript
const card = await square.giftCards.create({ type: 'DIGITAL' });
console.log('GAN:', card.gan);          // 16-digit Square-generated number
console.log('State:', card.state);      // PENDING
```

New cards start in `PENDING`. They must be activated with an initial balance before redemption.

### Physical Card (Pre-Printed GAN)

```typescript
const card = await square.giftCards.create({
  type: 'PHYSICAL',
  gan: '7783000011112222',  // printed on the physical card
});
```

### Custom GAN

For application-supplied GANs (8–20 alphanumeric characters):

```typescript
const card = await square.giftCards.create({
  type: 'DIGITAL',
  gan: 'PROMO-2026-001',
  ganSource: 'OTHER',
});
```

> Custom GANs must not collide with existing cards or share a BIN with major credit cards. Avoid easy-to-guess values.

## Activating a Card

The convenience helper:

```typescript
await square.giftCards.activate(card.id!, 2500);  // $25.00 in cents
```

Or the explicit form:

```typescript
await square.giftCards.activities.create({
  type: 'ACTIVATE',
  giftCardId: card.id,
  activateActivityDetails: {
    amountMoney: { amount: 2500, currency: 'USD' },
    orderId: 'ORDER_123',         // if processed via Orders API
    lineItemUid: 'GIFT_CARD_LI',  // GIFT_CARD line item UID on that order
  },
});
```

## Loading (Topping Up) a Card

```typescript
await square.giftCards.load(card.id!, 1000, {
  referenceId: 'topup-2026-01',
});
```

## Redeeming

For payments processed through the Square Payments API, Square creates the `REDEEM` activity automatically — you do **not** need to call this.

For custom payment processors:

```typescript
await square.giftCards.redeem(card.id!, 500, {
  paymentId: 'PAY_456',
});
```

## Looking Up a Card

By ID:

```typescript
const card = await square.giftCards.get('gftc:abc123');
```

By GAN (e.g. card number entered at checkout):

```typescript
const card = await square.giftCards.getFromGan('7783000011112222');
```

By payment-source nonce (e.g. produced by the Square Web Payments SDK):

```typescript
const card = await square.giftCards.getFromNonce('cnon:gift-card-nonce');
```

## Listing Cards

```typescript
const { giftCards, cursor } = await square.giftCards.list({
  type: 'DIGITAL',
  state: 'ACTIVE',
  limit: 50,
});

for (const card of giftCards) {
  console.log(card.gan, card.balanceMoney?.amount);
}
```

### With Pagination

```typescript
let cursor: string | undefined;
const all = [];

do {
  const page = await square.giftCards.list({ limit: 100, cursor });
  all.push(...page.giftCards);
  cursor = page.cursor;
} while (cursor);
```

## Linking a Customer

```typescript
const updated = await square.giftCards.linkCustomer(card.id!, 'CUST_123');
console.log(updated.customerIds);  // ['CUST_123']
```

The card now appears in `square.customers.get('CUST_123')`'s gift card list and in `list({ customerId: 'CUST_123' })`.

### Unlinking

```typescript
await square.giftCards.unlinkCustomer(card.id!, 'CUST_123');
```

## Deactivating a Card

```typescript
await square.giftCards.deactivate(card.id!, 'SUSPICIOUS_ACTIVITY');
```

Valid reasons: `SUSPICIOUS_ACTIVITY`, `CHARGEBACK_DEACTIVATE`, `UNKNOWN_REASON` (default).

## Listing Activities

```typescript
const { activities, cursor } = await square.giftCards.activities.list({
  giftCardId: 'gftc:abc',
  type: 'REDEEM',
  sortOrder: 'DESC',
});
```

Without `giftCardId`, lists activities across all of a seller's cards.

## Adjustments (Manual Balance Changes)

For balance corrections outside a normal ACTIVATE/LOAD/REDEEM/REFUND flow:

```typescript
// Add $5 (e.g. comp for a service issue)
await square.giftCards.activities.create({
  type: 'ADJUST_INCREMENT',
  giftCardId: card.id,
  adjustIncrementActivityDetails: {
    amountMoney: { amount: 500, currency: 'USD' },
    reason: 'COMPLIMENTARY',  // or SUPPORT_ISSUE, TRANSACTION_VOIDED
  },
});

// Remove balance (e.g. clear a remainder)
await square.giftCards.activities.create({
  type: 'ADJUST_DECREMENT',
  giftCardId: card.id,
  adjustDecrementActivityDetails: {
    amountMoney: { amount: 100, currency: 'USD' },
    reason: 'BALANCE_REMAINING',  // or SUSPICIOUS_ACTIVITY
  },
});
```

## GiftCard Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Square-assigned ID |
| `type` | `GiftCardType` | `DIGITAL` / `PHYSICAL` |
| `ganSource` | `GiftCardGanSource` | `SQUARE` / `OTHER` |
| `state` | `GiftCardState` | `PENDING` / `ACTIVE` / `DEACTIVATED` / `BLOCKED` / `UNLINKED_OWNER` |
| `balanceMoney` | `Money` | Current balance (>= 0) |
| `gan` | `string` | Account number used at checkout |
| `customerIds` | `string[]` | Linked customer profiles |
| `createdAt` | `string` | RFC 3339 timestamp |

## Error Handling

```typescript
import {
  SquareValidationError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  await square.giftCards.activate(cardId, -100);  // negative amount
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.error('Validation:', error.message);
  } else if (error instanceof SquareApiError) {
    console.error('API:', error.errors);
  }
}
```

## Best Practices

1. **Always use stable idempotency keys for activities** — a duplicate `REDEEM` retry would double-deduct the card. Pass `idempotencyKey: \`redeem-${paymentId}\`` (or similar) instead of letting it auto-generate when retrying.
2. **Activate before redemption** — a fresh `PENDING` card cannot be redeemed. Call `activate()` after `create()`.
3. **Use the convenience helpers** — `activate`, `load`, `redeem`, `deactivate` are simpler than building activity payloads by hand.
4. **Link customers for personalization** — `linkCustomer` makes the card show up in a customer's profile and gift card list, useful for self-service balance lookups.
5. **Don't manually create REDEEM activities** for Square-processed payments — Square does this for you. Manual REDEEM is only for custom payment processors.

## Next Steps

- [Customers Guide](./customers.md) - Manage the underlying customer records
- [Payments Guide](./payments.md) - Process payments (Square handles REDEEM automatically)
- [Orders Guide](./orders.md) - Use `GIFT_CARD` line items in orders
