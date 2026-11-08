[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CustomersService

# Class: CustomersService

Defined in: core/services/customers.service.ts:75

Customers service wrapping Clover's Platform
[customers](https://docs.clover.com/dev/reference/customerscreatecustomer)
API (`/v3/merchants/{mId}/customers`).

Requires a `merchantId` on the client.

## Example

```typescript
const customer = await clover.customers.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
});
```

## Constructors

### Constructor

> **new CustomersService**(`http`): `CustomersService`

Defined in: core/services/customers.service.ts:76

#### Parameters

##### http

[`CloverHttp`](CloverHttp.md)

#### Returns

`CustomersService`

## Methods

### create()

> **create**(`options`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: core/services/customers.service.ts:94

Create a customer.

#### Parameters

##### options

[`CreateCustomerOptions`](../interfaces/CreateCustomerOptions.md)

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>

#### Throws

When no identifying field is provided

***

### delete()

> **delete**(`customerId`): `Promise`\<`void`\>

Defined in: core/services/customers.service.ts:144

Delete a customer.

#### Parameters

##### customerId

`string`

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`customerId`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: core/services/customers.service.ts:113

Retrieve a customer by ID.

#### Parameters

##### customerId

`string`

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Customer`](../interfaces/Customer.md)\>\>

Defined in: core/services/customers.service.ts:159

List customers with offset-based pagination.

#### Parameters

##### options?

[`PaginationOptions`](../interfaces/PaginationOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Customer`](../interfaces/Customer.md)\>\>

***

### update()

> **update**(`customerId`, `options`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: core/services/customers.service.ts:128

Update a customer.

#### Parameters

##### customerId

`string`

##### options

[`CreateCustomerOptions`](../interfaces/CreateCustomerOptions.md)

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>
