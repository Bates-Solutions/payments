[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CustomersService

# Class: CustomersService

Defined in: [core/services/customers.service.ts:78](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L78)

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

Defined in: [core/services/customers.service.ts:79](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L79)

#### Parameters

##### http

[`CloverHttp`](CloverHttp.md)

#### Returns

`CustomersService`

## Methods

### create()

> **create**(`options`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: [core/services/customers.service.ts:97](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L97)

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

> **delete**(`customerId`, `options?`): `Promise`\<`void`\>

Defined in: [core/services/customers.service.ts:151](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L151)

Delete a customer.

#### Parameters

##### customerId

`string`

##### options?

###### idempotencyKey?

`string`

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`customerId`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: [core/services/customers.service.ts:117](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L117)

Retrieve a customer by ID.

#### Parameters

##### customerId

`string`

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Customer`](../interfaces/Customer.md)\>\>

Defined in: [core/services/customers.service.ts:167](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L167)

List customers with offset-based pagination.

#### Parameters

##### options?

[`PaginationOptions`](../interfaces/PaginationOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<[`Customer`](../interfaces/Customer.md)\>\>

***

### update()

> **update**(`customerId`, `options`): `Promise`\<[`Customer`](../interfaces/Customer.md)\>

Defined in: [core/services/customers.service.ts:132](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/customers.service.ts#L132)

Update a customer.

#### Parameters

##### customerId

`string`

##### options

[`CreateCustomerOptions`](../interfaces/CreateCustomerOptions.md)

#### Returns

`Promise`\<[`Customer`](../interfaces/Customer.md)\>
