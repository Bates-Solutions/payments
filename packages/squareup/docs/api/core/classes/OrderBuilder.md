[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrderBuilder

# Class: OrderBuilder

Defined in: [src/core/builders/order.builder.ts:53](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L53)

Fluent builder for creating Square orders

## Example

```typescript
const order = await square.orders
  .builder()
  .addItem({ name: 'Latte', amount: 450 })
  .addItem({ catalogObjectId: 'ITEM_123', quantity: 2 })
  .withTip(100)
  .withCustomer('CUST_123')
  .build();
```

## Constructors

### Constructor

> **new OrderBuilder**(`client`, `locationId`): `OrderBuilder`

Defined in: [src/core/builders/order.builder.ts:60](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L60)

#### Parameters

##### client

`SquareClient`

##### locationId

`string`

#### Returns

`OrderBuilder`

## Methods

### addItem()

> **addItem**(`item`): `this`

Defined in: [src/core/builders/order.builder.ts:89](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L89)

Add a line item to the order

#### Parameters

##### item

[`LineItemInput`](../interfaces/LineItemInput.md)

Line item details

#### Returns

`this`

Builder instance for chaining

#### Example

```typescript
builder
  .addItem({ name: 'Coffee', amount: 350 })
  .addItem({ catalogObjectId: 'ITEM_123', quantity: 2 })
```

***

### addItems()

> **addItems**(`items`): `this`

Defined in: [src/core/builders/order.builder.ts:124](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L124)

Add multiple line items at once

#### Parameters

##### items

[`LineItemInput`](../interfaces/LineItemInput.md)[]

Array of line items

#### Returns

`this`

Builder instance for chaining

***

### build()

> **build**(): `Promise`\<`Order`\>

Defined in: [src/core/builders/order.builder.ts:184](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L184)

Build and create the order

#### Returns

`Promise`\<`Order`\>

Created order

#### Throws

When validation fails

#### Throws

When API call fails

***

### preview()

> **preview**(): `object`

Defined in: [src/core/builders/order.builder.ts:214](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L214)

Preview the order without creating it
Returns the order configuration that would be sent

#### Returns

`object`

##### currency

> **currency**: [`CurrencyCode`](../type-aliases/CurrencyCode.md)

##### customerId?

> `optional` **customerId**: `string`

##### lineItems

> **lineItems**: `OrderLineItem`[]

##### locationId

> **locationId**: `string`

##### referenceId?

> `optional` **referenceId**: `string`

##### tipAmount?

> `optional` **tipAmount**: `bigint`

***

### reset()

> **reset**(): `this`

Defined in: [src/core/builders/order.builder.ts:235](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L235)

Reset the builder to start fresh

#### Returns

`this`

***

### withCurrency()

> **withCurrency**(`currency`): `this`

Defined in: [src/core/builders/order.builder.ts:71](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L71)

Set the currency for the order

#### Parameters

##### currency

[`CurrencyCode`](../type-aliases/CurrencyCode.md)

Currency code

#### Returns

`this`

Builder instance for chaining

***

### withCustomer()

> **withCustomer**(`customerId`): `this`

Defined in: [src/core/builders/order.builder.ts:148](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L148)

Associate a customer with the order

#### Parameters

##### customerId

`string`

Square customer ID

#### Returns

`this`

Builder instance for chaining

***

### withNote()

> **withNote**(`_note`): `this`

Defined in: [src/core/builders/order.builder.ts:170](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L170)

Add a note to the order

#### Parameters

##### \_note

`string`

#### Returns

`this`

Builder instance for chaining

***

### withReference()

> **withReference**(`referenceId`): `this`

Defined in: [src/core/builders/order.builder.ts:159](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L159)

Add a reference ID for external tracking

#### Parameters

##### referenceId

`string`

External reference ID

#### Returns

`this`

Builder instance for chaining

***

### withTip()

> **withTip**(`amount`): `this`

Defined in: [src/core/builders/order.builder.ts:137](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/core/builders/order.builder.ts#L137)

Add a tip to the order

#### Parameters

##### amount

`number`

Tip amount in cents

#### Returns

`this`

Builder instance for chaining
