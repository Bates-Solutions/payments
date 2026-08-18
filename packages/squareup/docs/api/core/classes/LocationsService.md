[**@bates-solutions/squareup API Reference v1.15.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / LocationsService

# Class: LocationsService

Defined in: [core/services/locations.service.ts:33](https://github.com/mbates/squareup/blob/main/src/core/services/locations.service.ts#L33)

Locations service for reading a merchant's Square locations.

## Example

```typescript
// Derive the merchant's currency instead of configuring it
const [location] = await square.locations.list();
const currency = location?.currency; // e.g. 'CAD'
```

## Constructors

### Constructor

> **new LocationsService**(`client`): `LocationsService`

Defined in: [core/services/locations.service.ts:34](https://github.com/mbates/squareup/blob/main/src/core/services/locations.service.ts#L34)

#### Parameters

##### client

`SquareClient`

#### Returns

`LocationsService`

## Methods

### get()

> **get**(`locationId`): `Promise`\<[`Location`](../interfaces/Location.md)\>

Defined in: [core/services/locations.service.ts:69](https://github.com/mbates/squareup/blob/main/src/core/services/locations.service.ts#L69)

Get a single location by ID.

#### Parameters

##### locationId

`string`

Location ID

#### Returns

`Promise`\<[`Location`](../interfaces/Location.md)\>

The location

#### Example

```typescript
const location = await square.locations.get('LXXX');
console.log(location.currency); // 'CAD'
```

***

### list()

> **list**(): `Promise`\<[`Location`](../interfaces/Location.md)[]\>

Defined in: [core/services/locations.service.ts:48](https://github.com/mbates/squareup/blob/main/src/core/services/locations.service.ts#L48)

List all locations for the merchant.

The Square Locations API is not paginated — every location is returned.

#### Returns

`Promise`\<[`Location`](../interfaces/Location.md)[]\>

Array of locations

#### Example

```typescript
const locations = await square.locations.list();
```
