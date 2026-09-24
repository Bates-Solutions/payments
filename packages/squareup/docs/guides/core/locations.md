# Locations

The `locations` service reads a merchant's Square locations. Its most common use is **deriving the merchant's currency** so you don't have to configure or hardcode it.

## List locations

The Square Locations API is not paginated — `list()` returns every location.

```typescript
const locations = await square.locations.list();

for (const location of locations) {
  console.log(location.name, location.currency, location.status);
}
```

Each location exposes:

| Field      | Description                                              |
| ---------- | ------------------------------------------------------- |
| `id`       | Location ID                                             |
| `name`     | Location nickname (Seller Dashboard)                    |
| `country`  | Two-letter ISO 3166 country code (e.g. `US`, `CA`)      |
| `currency` | ISO 4217 currency code (e.g. `USD`, `CAD`)              |
| `status`   | `ACTIVE` or `INACTIVE`                                  |

## Get a single location

```typescript
const location = await square.locations.get('LXXX');
console.log(location.currency); // e.g. 'CAD'
```

Throws if the location is not found.

## Errors and scopes

Both methods require the access token to have the `MERCHANT_PROFILE_READ` scope. If Square rejects the request — including the case where it answers with an `errors` body instead of locations — the call throws a `SquareApiError` rather than returning an empty result:

```typescript
import { SquareApiError } from '@bates-solutions/squareup';

try {
  const locations = await square.locations.list();
} catch (error) {
  if (error instanceof SquareApiError && error.code === 'INSUFFICIENT_SCOPES') {
    // The token is missing MERCHANT_PROFILE_READ — reconnect / re-authorize
  }
  throw error;
}
```

So an empty array from `list()` always means the merchant genuinely has no locations, never a credential problem.

## Deriving currency instead of configuring it

Rather than setting [`defaultCurrency`](../../getting-started/configuration.md) from a value that can drift from the merchant's real account, read it from the account:

```typescript
const [location] = await square.locations.list();
const currency = location?.currency ?? 'USD'; // fallback only for a merchant with no locations

await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000,
  currency,
});
```

This pairs with the client's `defaultCurrency` option (which sets the fallback for money-carrying calls) — use whichever fits: configure it once, or derive it from `locations`.
