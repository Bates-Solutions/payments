[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CustomersService

# Class: CustomersService

Defined in: [core/services/customers.service.ts:140](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L140)

Customers service for managing Square customers

## Example

```typescript
// Create a customer
const customer = await square.customers.create({
  givenName: 'John',
  familyName: 'Doe',
  emailAddress: 'john@example.com',
});

// Search customers
const results = await square.customers.search({
  emailAddress: 'john@example.com',
});
```

## Constructors

### Constructor

> **new CustomersService**(`client`): `CustomersService`

Defined in: [core/services/customers.service.ts:141](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L141)

#### Parameters

##### client

`SquareClient`

#### Returns

`CustomersService`

## Methods

### create()

> **create**(`options`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: [core/services/customers.service.ts:159](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L159)

Create a new customer

#### Parameters

##### options

[`CreateCustomerOptions`](../interfaces/CreateCustomerOptions.md)

Customer creation options

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>

Created customer

#### Example

```typescript
const customer = await square.customers.create({
  givenName: 'John',
  familyName: 'Doe',
  emailAddress: 'john@example.com',
  phoneNumber: '+15551234567',
});
```

***

### delete()

> **delete**(`customerId`): `Promise`\<`void`\>

Defined in: [core/services/customers.service.ts:273](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L273)

Delete a customer

#### Parameters

##### customerId

`string`

Customer ID to delete

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await square.customers.delete('CUST_123');
```

***

### get()

> **get**(`customerId`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: [core/services/customers.service.ts:209](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L209)

Get a customer by ID

#### Parameters

##### customerId

`string`

Customer ID

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>

Customer details

#### Example

```typescript
const customer = await square.customers.get('CUST_123');
```

***

### list()

> **list**(`options?`): `Promise`\<\{ `cursor?`: `string`; `customers`: [`Customer`](../interfaces/Customer.md)[]; \}\>

Defined in: [core/services/customers.service.ts:427](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L427)

List customers with cursor-based pagination

#### Parameters

##### options?

[`ListCustomersOptions`](../interfaces/ListCustomersOptions.md)

List options including cursor for pagination

#### Returns

`Promise`\<\{ `cursor?`: `string`; `customers`: [`Customer`](../interfaces/Customer.md)[]; \}\>

Customers and optional cursor for next page

#### Example

```typescript
// Get first page
const page1 = await square.customers.list({ limit: 50 });

// Get next page using cursor
const page2 = await square.customers.list({ cursor: page1.cursor, limit: 50 });

// Sort by creation time, newest first
const recent = await square.customers.list({ sortField: 'CREATED_AT', sortOrder: 'DESC' });
```

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: [`Customer`](../interfaces/Customer.md)[]; \}\>

Defined in: [core/services/customers.service.ts:300](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L300)

Search for customers

#### Parameters

##### options?

[`SearchCustomersOptions`](../interfaces/SearchCustomersOptions.md)

Search options

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: [`Customer`](../interfaces/Customer.md)[]; \}\>

Matching customers with pagination

#### Example

```typescript
// Search by email
const results = await square.customers.search({
  emailAddress: 'john@example.com',
});

// Search by phone
const results = await square.customers.search({
  phoneNumber: '+15551234567',
});
```

***

### update()

> **update**(`customerId`, `options`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: [core/services/customers.service.ts:237](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customers.service.ts#L237)

Update a customer

#### Parameters

##### customerId

`string`

Customer ID to update

##### options

[`UpdateCustomerOptions`](../interfaces/UpdateCustomerOptions.md)

Update options

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>

Updated customer

#### Example

```typescript
const customer = await square.customers.update('CUST_123', {
  emailAddress: 'newemail@example.com',
});
```
