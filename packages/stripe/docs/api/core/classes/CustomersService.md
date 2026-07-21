[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CustomersService

# Class: CustomersService

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:82](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L82)
=======
Defined in: [core/services/customers.service.ts:82](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L82)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:83](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L83)
=======
Defined in: [core/services/customers.service.ts:83](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L83)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Parameters

##### client

`Stripe`

#### Returns

`CustomersService`

## Methods

### create()

> **create**(`options`): `Promise`\<`Customer`\>

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:102](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L102)
=======
Defined in: [core/services/customers.service.ts:102](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L102)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:191](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L191)
=======
Defined in: [core/services/customers.service.ts:192](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L192)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:139](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L139)
=======
Defined in: [core/services/customers.service.ts:140](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L140)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Retrieve a customer by ID.

#### Parameters

##### customerId

`string`

Customer ID

#### Returns

`Promise`\<`Customer`\>

The customer

#### Throws

When the customer has been deleted

#### Throws

When the customer is not found

#### Example

```typescript
const customer = await stripe.customers.get('cus_123');
```

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Customer`\>\>

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:211](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L211)
=======
Defined in: [core/services/customers.service.ts:212](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L212)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:243](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L243)
=======
Defined in: [core/services/customers.service.ts:244](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L244)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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

<<<<<<< HEAD
Defined in: [core/services/customers.service.ts:166](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/customers.service.ts#L166)
=======
Defined in: [core/services/customers.service.ts:167](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/customers.service.ts#L167)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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
