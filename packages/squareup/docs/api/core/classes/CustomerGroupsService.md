[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CustomerGroupsService

# Class: CustomerGroupsService

Defined in: [core/services/customer-groups.service.ts:50](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L50)

Customer Groups service for managing Square customer groups and memberships.

Customer groups are the primary way to gate pricing rules (wholesale tiers,
member discounts) to specific customers.

## Example

```typescript
const group = await square.customerGroups.create({ name: 'Wholesale' });
await square.customerGroups.addCustomer(group.id!, 'CUST_123');
```

## Constructors

### Constructor

> **new CustomerGroupsService**(`client`): `CustomerGroupsService`

Defined in: [core/services/customer-groups.service.ts:51](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L51)

#### Parameters

##### client

`SquareClient`

#### Returns

`CustomerGroupsService`

## Methods

### addCustomer()

> **addCustomer**(`groupId`, `customerId`): `Promise`\<`void`\>

Defined in: [core/services/customer-groups.service.ts:156](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L156)

Add a customer to a group.

#### Parameters

##### groupId

`string`

##### customerId

`string`

#### Returns

`Promise`\<`void`\>

***

### create()

> **create**(`options`): `Promise`\<`CustomerGroup`\>

Defined in: [core/services/customer-groups.service.ts:56](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L56)

Create a new customer group.

#### Parameters

##### options

`CreateCustomerGroupOptions`

#### Returns

`Promise`\<`CustomerGroup`\>

***

### delete()

> **delete**(`groupId`): `Promise`\<`void`\>

Defined in: [core/services/customer-groups.service.ts:124](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L124)

Delete a customer group. Customers are not deleted — only the group and
its memberships.

#### Parameters

##### groupId

`string`

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`groupId`): `Promise`\<`CustomerGroup`\>

Defined in: [core/services/customer-groups.service.ts:80](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L80)

Get a customer group by ID.

#### Parameters

##### groupId

`string`

#### Returns

`Promise`\<`CustomerGroup`\>

***

### list()

> **list**(`options?`): `Promise`\<\{ `cursor?`: `string`; `groups`: `CustomerGroup`[]; \}\>

Defined in: [core/services/customer-groups.service.ts:135](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L135)

List customer groups with cursor-based pagination.

#### Parameters

##### options?

`ListCustomerGroupsOptions`

#### Returns

`Promise`\<\{ `cursor?`: `string`; `groups`: `CustomerGroup`[]; \}\>

***

### removeCustomer()

> **removeCustomer**(`groupId`, `customerId`): `Promise`\<`void`\>

Defined in: [core/services/customer-groups.service.ts:167](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L167)

Remove a customer from a group.

#### Parameters

##### groupId

`string`

##### customerId

`string`

#### Returns

`Promise`\<`void`\>

***

### update()

> **update**(`groupId`, `options`): `Promise`\<`CustomerGroup`\>

Defined in: [core/services/customer-groups.service.ts:97](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/core/services/customer-groups.service.ts#L97)

Update a customer group's name.

#### Parameters

##### groupId

`string`

##### options

`UpdateCustomerGroupOptions`

#### Returns

`Promise`\<`CustomerGroup`\>
