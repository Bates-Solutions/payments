[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / SquareCustomersService

# Class: SquareCustomersService

Defined in: [src/angular/services/square-customers.service.ts:30](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L30)

Service for Square customer operations

## Example

```typescript
@Component({...})
export class CustomerComponent {
  constructor(private customers: SquareCustomersService) {}

  createCustomer() {
    this.customers.create({
      givenName: 'John',
      familyName: 'Doe',
      emailAddress: 'john@example.com'
    }).subscribe(customer => {
      console.log('Customer created:', customer);
    });
  }
}
```

## Constructors

### Constructor

> **new SquareCustomersService**(): `SquareCustomersService`

#### Returns

`SquareCustomersService`

## Properties

### error$

> `readonly` **error$**: `Observable`\<`Error` \| `null`\>

Defined in: [src/angular/services/square-customers.service.ts:38](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L38)

Observable of errors

***

### loading$

> `readonly` **loading$**: `Observable`\<`boolean`\>

Defined in: [src/angular/services/square-customers.service.ts:35](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L35)

Observable of loading state

## Methods

### create()

> **create**\<`T`\>(`request`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-customers.service.ts:47](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L47)

Create a customer via backend API

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### request

[`CreateCustomerRequest`](../interfaces/CreateCustomerRequest.md)

Customer creation request

##### apiEndpoint

`string` = `'/api/customers'`

Backend API endpoint (default: '/api/customers')

#### Returns

`Observable`\<`T`\>

Observable of the customer response

***

### delete()

> **delete**(`customerId`, `apiEndpoint`): `Observable`\<`void`\>

Defined in: [src/angular/services/square-customers.service.ts:170](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L170)

Delete a customer

#### Parameters

##### customerId

`string`

The customer ID

##### apiEndpoint

`string` = `'/api/customers'`

Backend API endpoint (default: '/api/customers')

#### Returns

`Observable`\<`void`\>

Observable that completes on success

***

### retrieve()

> **retrieve**\<`T`\>(`customerId`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-customers.service.ts:92](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L92)

Retrieve a customer by ID

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### customerId

`string`

The customer ID

##### apiEndpoint

`string` = `'/api/customers'`

Backend API endpoint (default: '/api/customers')

#### Returns

`Observable`\<`T`\>

Observable of the customer

***

### search()

> **search**\<`T`\>(`query`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-customers.service.ts:205](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L205)

Search for customers

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### query

Search query

###### emailAddress?

`string`

###### phoneNumber?

`string`

###### referenceId?

`string`

##### apiEndpoint

`string` = `'/api/customers'`

Backend API endpoint (default: '/api/customers')

#### Returns

`Observable`\<`T`\>

Observable of matching customers

***

### update()

> **update**\<`T`\>(`customerId`, `request`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-customers.service.ts:129](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-customers.service.ts#L129)

Update a customer

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### customerId

`string`

The customer ID

##### request

`Partial`\<[`CreateCustomerRequest`](../interfaces/CreateCustomerRequest.md)\>

Customer update request

##### apiEndpoint

`string` = `'/api/customers'`

Backend API endpoint (default: '/api/customers')

#### Returns

`Observable`\<`T`\>

Observable of the updated customer
