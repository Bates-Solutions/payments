[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CustomersService

# Class: CustomersService

Defined in: core/services/customers.service.ts:82

Customers service wrapping Stripe Customers.

## Example

```typescript
const customer = await stripe.customers.create({
  email: 'john@example.com',
  name: 'John Doe',
});
```

## Constructors

### Constructor

> **new CustomersService**(`client`): `CustomersService`

Defined in: core/services/customers.service.ts:83

#### Parameters

##### client

`Stripe`

#### Returns

`CustomersService`

## Methods

### create()

> **create**(`options`): `Promise`\<`Customer`\>

Defined in: core/services/customers.service.ts:102

Create a new customer.

#### Parameters

##### options

[`CreateCustomerOptions`](../interfaces/CreateCustomerOptions.md)

Customer creation options

#### Returns

`Promise`\<`Customer`\>

Created customer

#### Throws

When no identifying field is provided

#### Example

```typescript
const customer = await stripe.customers.create({
  email: 'john@example.com',
  name: 'John Doe',
  phone: '+15551234567',
});
```

***

### delete()

> **delete**(`customerId`): `Promise`\<`void`\>

Defined in: core/services/customers.service.ts:191

Delete a customer.

#### Parameters

##### customerId

`string`

Customer ID to delete

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await stripe.customers.delete('cus_123');
```

***

### get()

> **get**(`customerId`): `Promise`\<`Customer`\>

Defined in: core/services/customers.service.ts:139

Retrieve a customer by ID.

#### Parameters

##### customerId

`string`

Customer ID

#### Returns

`Promise`\<`Customer`\>

The customer

#### Throws

When the customer has been deleted or not found

#### Example

```typescript
const customer = await stripe.customers.get('cus_123');
```

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Customer`\>\>

Defined in: core/services/customers.service.ts:211

List customers with cursor-based pagination.

#### Parameters

##### options?

[`ListCustomersOptions`](../interfaces/ListCustomersOptions.md)

List options

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Customer`\>\>

Customers and a cursor for the next page

#### Example

```typescript
const page1 = await stripe.customers.list({ limit: 50 });
const page2 = await stripe.customers.list({ startingAfter: page1.nextCursor });
```

***

### search()

> **search**(`query`, `options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Customer`\>\>

Defined in: core/services/customers.service.ts:243

Search customers with Stripe's search query language.

#### Parameters

##### query

`string`

Search query (e.g. `email:'john@example.com'`)

##### options?

Optional limit and pagination cursor

###### limit?

`number`

###### page?

`string`

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Customer`\>\>

Matching customers and a cursor for the next page

#### See

https://docs.stripe.com/search#search-query-language

#### Example

```typescript
const { data } = await stripe.customers.search("email:'john@example.com'");
```

***

### update()

> **update**(`customerId`, `options`): `Promise`\<`Customer`\>

Defined in: core/services/customers.service.ts:166

Update a customer.

#### Parameters

##### customerId

`string`

Customer ID to update

##### options

[`UpdateCustomerOptions`](../interfaces/UpdateCustomerOptions.md)

Update options

#### Returns

`Promise`\<`Customer`\>

The updated customer

#### Example

```typescript
const customer = await stripe.customers.update('cus_123', {
  email: 'new@example.com',
});
```
