[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CustomersService

# Class: CustomersService

Defined in: [src/core/services/customers.service.ts:108](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L108)

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

Defined in: [src/core/services/customers.service.ts:109](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L109)

#### Parameters

##### client

`SquareClient`

#### Returns

`CustomersService`

## Methods

### create()

> **create**(`options`): `Promise`\<`Customer`\>

Defined in: [src/core/services/customers.service.ts:127](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L127)

Create a new customer

#### Parameters

##### options

`CreateCustomerOptions`

Customer creation options

#### Returns

`Promise`\<`Customer`\>

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

Defined in: [src/core/services/customers.service.ts:241](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L241)

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

> **get**(`customerId`): `Promise`\<`Customer`\>

Defined in: [src/core/services/customers.service.ts:177](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L177)

Get a customer by ID

#### Parameters

##### customerId

`string`

Customer ID

#### Returns

`Promise`\<`Customer`\>

Customer details

#### Example

```typescript
const customer = await square.customers.get('CUST_123');
```

***

### list()

> **list**(`options?`): `Promise`\<`Customer`[]\>

Defined in: [src/core/services/customers.service.ts:330](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L330)

List all customers

#### Parameters

##### options?

List options

###### limit?

`number`

#### Returns

`Promise`\<`Customer`[]\>

Array of customers

#### Example

```typescript
const customers = await square.customers.list({ limit: 50 });
```

***

### search()

> **search**(`options?`): `Promise`\<\{ `cursor?`: `string`; `data`: `Customer`[]; \}\>

Defined in: [src/core/services/customers.service.ts:268](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L268)

Search for customers

#### Parameters

##### options?

`SearchCustomersOptions`

Search options

#### Returns

`Promise`\<\{ `cursor?`: `string`; `data`: `Customer`[]; \}\>

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

> **update**(`customerId`, `options`): `Promise`\<`Customer`\>

Defined in: [src/core/services/customers.service.ts:205](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/services/customers.service.ts#L205)

Update a customer

#### Parameters

##### customerId

`string`

Customer ID to update

##### options

`UpdateCustomerOptions`

Update options

#### Returns

`Promise`\<`Customer`\>

Updated customer

#### Example

```typescript
const customer = await square.customers.update('CUST_123', {
  emailAddress: 'newemail@example.com',
});
```
