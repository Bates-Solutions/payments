# Managing Subscriptions

This guide covers Square subscriptions — both flat-rate plan variations and product-driven recurring billing via order templates.

## Prerequisites

- Square account with API credentials
- `@bates-solutions/squareup` installed
- A Square subscription plan + at least one plan variation (created via `square.catalog.upsert` with `type: 'SUBSCRIPTION_PLAN'` / `SUBSCRIPTION_PLAN_VARIATION`)

## Setup

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
  locationId: 'YOUR_LOCATION_ID',
});
```

## Creating a Subscription

### Flat-Rate (Plan Variation)

The simplest case — bill a fixed amount on a schedule defined by a `STATIC` plan variation:

```typescript
const subscription = await square.subscriptions.create({
  customerId: 'CUST_123',
  planVariationId: 'PLAN_VAR_MONTHLY_30',
  startDate: '2026-05-01',
  cardId: 'CARD_ON_FILE_ID',
});
```

### Product-Driven Subscriptions

For subscriptions that ship specific catalog items each cycle — and re-apply pricing rules (wholesale tiers, member discounts) at each billing cycle — use an **order template** in a phase:

```typescript
// 1. Create the order template (DRAFT state + auto-apply discounts).
//    See docs/guides/core/orders.md#order-templates for details.
const template = await square.orders
  .builder()
  .addItem({ catalogObjectId: 'VAR_PICKLES_DILL', quantity: 2 })
  .addItem({ catalogObjectId: 'VAR_PICKLES_SPICY', quantity: 1 })
  .withCustomer('CUST_RETAILER_42')
  .asTemplate()
  .build();

// 2. Create the subscription with a phase pointing at the template.
const subscription = await square.subscriptions.create({
  customerId: 'CUST_RETAILER_42',
  phases: [{ orderTemplateId: template.id! }],
  startDate: '2026-05-01',
  cardId: 'CARD_RETAILER_42',
});
```

At each billing cycle Square invoices the template's line items and re-evaluates catalog pricing rules. If the retailer is a member of a wholesale customer group, the wholesale rule fires automatically — no app-side price math.

### Multiple Phases

```typescript
await square.subscriptions.create({
  customerId: 'CUST_123',
  phases: [
    { ordinal: 0, orderTemplateId: 'TEMPLATE_INTRO_MONTH' },
    { ordinal: 1, orderTemplateId: 'TEMPLATE_REGULAR' },
  ],
  startDate: '2026-05-01',
});
```

`ordinal` defaults to array position. Pass `number` or `bigint` — both are coerced to bigint at the SDK boundary.

### Flat-Rate + Phases Combined

When the plan variation itself uses `RELATIVE` pricing (percentage-of-template), pass **both** `planVariationId` and `phases[]`:

```typescript
await square.subscriptions.create({
  customerId: 'CUST_123',
  planVariationId: 'PLAN_VAR_RELATIVE_NET30',
  phases: [{ orderTemplateId: template.id! }],
});
```

## Getting a Subscription

```typescript
const subscription = await square.subscriptions.get('SUB_123');

console.log('Status:', subscription.status);
console.log('Charged through:', subscription.chargedThroughDate);
```

## Updating a Subscription

```typescript
const updated = await square.subscriptions.update('SUB_123', {
  priceOverride: 1800,  // cents
  cardId: 'NEW_CARD_ID',
  taxPercentage: '8.5',
});
```

## Pausing and Resuming

```typescript
// Pause from a date, for N billing cycles
await square.subscriptions.pause('SUB_123', {
  pauseEffectiveDate: '2026-06-01',
  pauseCycleDuration: 2,
});

// Resume (defaults to immediately)
await square.subscriptions.resume('SUB_123');

// Or resume on a specific date
await square.subscriptions.resume('SUB_123', '2026-08-01');
```

## Cancelling

```typescript
const cancelled = await square.subscriptions.cancel('SUB_123');
console.log('Canceled date:', cancelled.canceledDate);
```

Cancellation takes effect at the end of the current billing cycle — Square continues to bill through `chargedThroughDate`.

## Searching Subscriptions

```typescript
// By customer
const { data } = await square.subscriptions.search({
  customerId: 'CUST_123',
});

// By location (with pagination)
const page1 = await square.subscriptions.search({
  locationIds: ['LOC_1', 'LOC_2'],
  limit: 50,
});
const page2 = await square.subscriptions.search({
  locationIds: ['LOC_1', 'LOC_2'],
  limit: 50,
  cursor: page1.cursor,
});
```

## Subscription Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique subscription ID |
| `status` | `SubscriptionStatus` | `PENDING` / `ACTIVE` / `CANCELED` / `DEACTIVATED` / `PAUSED` |
| `customerId` | `string` | Billed customer |
| `planVariationId` | `string` | Plan variation (if any) |
| `startDate` | `string` | Start date (YYYY-MM-DD) |
| `chargedThroughDate` | `string` | Paid through this date |
| `canceledDate` | `string` | Cancellation date (if any) |
| `priceOverrideMoney` | `Money` | Override applied to plan base price |
| `taxPercentage` | `string` | Tax percentage applied |
| `cardId` | `string` | Card on file used for billing |
| `version` | `bigint` | Optimistic concurrency version |

## Error Handling

```typescript
import {
  SquareValidationError,
  SquareApiError,
} from '@bates-solutions/squareup';

try {
  await square.subscriptions.create({
    customerId: 'CUST_123',
    // missing both planVariationId and phases
  });
} catch (error) {
  if (error instanceof SquareValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof SquareApiError) {
    console.error('API error:', error.errors);
  }
}
```

## Best Practices

1. **One of `planVariationId` or `phases[]` is required** — pass both only for `RELATIVE`-priced plans.
2. **Use stable idempotency keys** — `createIdempotencyKey()` generates a UUID by default; override with a deterministic key (e.g. `sub-${customerId}-${yyyyMm}`) if retries might fire twice.
3. **Card on file before creating** — subscriptions need a saved card. Create one via the raw SDK (`square.sdk.cards.create`) and pass its `id` as `cardId`.
4. **Template the customer** — set `customerId` on the order template too. Pricing rules gated by customer group only fire when the subscription customer matches.
5. **Keep templates small** — one template per retailer is the typical pattern; more flexible than one giant shared template.

## Next Steps

- [Order Templates](./orders.md#order-templates) - Create the DRAFT orders that back subscription phases
- [Wholesale Pricing](./catalog.md#wholesale-pricing) - Pricing rules gated by customer group
- [Customer Groups](./customer-groups.md) - Assign retailers to wholesale tiers
