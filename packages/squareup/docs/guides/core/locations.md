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

## Deriving currency instead of configuring it

Rather than setting [`defaultCurrency`](../../getting-started/configuration.md) from a value that can drift from the merchant's real account, read it from the account:

```typescript
const [location] = await square.locations.list();
const currency = location?.currency ?? 'USD';

await square.payments.create({
  sourceId: 'cnon:card-nonce-ok',
  amount: 1000,
  currency,
});
```

This pairs with the client's `defaultCurrency` option (which sets the fallback for money-carrying calls) — use whichever fits: configure it once, or derive it from `locations`.
