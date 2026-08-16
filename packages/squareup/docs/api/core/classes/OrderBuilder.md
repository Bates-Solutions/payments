[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OrderBuilder

# Class: OrderBuilder

Defined in: [core/builders/order.builder.ts:56](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L56)

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

> **new OrderBuilder**(`client`, `locationId`, `defaultCurrency?`): `OrderBuilder`

Defined in: [core/builders/order.builder.ts:66](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L66)

#### Parameters

##### client

`SquareClient`

##### locationId

`string`

##### defaultCurrency?

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

#### Returns

`OrderBuilder`

## Methods

### addItem()

> **addItem**(`item`): `this`

Defined in: [core/builders/order.builder.ts:98](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L98)

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

Defined in: [core/builders/order.builder.ts:144](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L144)

Add multiple line items at once

#### Parameters

##### items

[`LineItemInput`](../interfaces/LineItemInput.md)[]

Array of line items

#### Returns

`this`

Builder instance for chaining

***

### asTemplate()

> **asTemplate**(): `this`

Defined in: [core/builders/order.builder.ts:220](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L220)

Shorthand for configuring an order as a subscription template: sets state
to `DRAFT` and enables automatic discount application so pricing rules fire
at billing time.

#### Returns

`this`

***

### build()

> **build**(): `Promise`\<[`Order`](../interfaces/Order.md)\>

Defined in: [core/builders/order.builder.ts:241](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L241)

Build and create the order

#### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

Created order

#### Throws

When validation fails

#### Throws

When API call fails

***

### preview()

> **preview**(): `object`

Defined in: [core/builders/order.builder.ts:273](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L273)

Preview the order without creating it
Returns the order configuration that would be sent

#### Returns

`object`

##### currency

> **currency**: `"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

##### customerId?

> `optional` **customerId?**: `string`

##### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

##### lineItems

> **lineItems**: `OrderLineItem`[]

##### locationId

> **locationId**: `string`

##### pricingOptions?

> `optional` **pricingOptions?**: [`OrderPricingOptions`](../interfaces/OrderPricingOptions.md)

##### referenceId?

> `optional` **referenceId?**: `string`

##### state?

> `optional` **state?**: `OrderState`

##### tipAmount?

> `optional` **tipAmount?**: `bigint`

***

### reset()

> **reset**(): `this`

Defined in: [core/builders/order.builder.ts:300](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L300)

Reset the builder to start fresh

#### Returns

`this`

***

### withCurrency()

> **withCurrency**(`currency`): `this`

Defined in: [core/builders/order.builder.ts:80](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L80)

Set the currency for the order

#### Parameters

##### currency

`"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

Currency code

#### Returns

`this`

Builder instance for chaining

***

### withCustomer()

> **withCustomer**(`customerId`): `this`

Defined in: [core/builders/order.builder.ts:168](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L168)

Associate a customer with the order

#### Parameters

##### customerId

`string`

Square customer ID

#### Returns

`this`

Builder instance for chaining

***

### withIdempotencyKey()

> **withIdempotencyKey**(`key`): `this`

Defined in: [core/builders/order.builder.ts:228](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L228)

Provide an explicit idempotency key. Useful for retrying subscription
template creation without producing duplicate orders.

#### Parameters

##### key

`string`

#### Returns

`this`

***

### withNote()

> **withNote**(`_note`): `this`

Defined in: [core/builders/order.builder.ts:190](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L190)

Add a note to the order

#### Parameters

##### \_note

`string`

#### Returns

`this`

Builder instance for chaining

***

### withPricingOptions()

> **withPricingOptions**(`options`): `this`

Defined in: [core/builders/order.builder.ts:210](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L210)

Set pricing options. `autoApplyDiscounts: true` is required for templates
that should pick up customer-group pricing rules (wholesale tiers) at each
subscription billing cycle.

#### Parameters

##### options

[`OrderPricingOptions`](../interfaces/OrderPricingOptions.md)

#### Returns

`this`

***

### withReference()

> **withReference**(`referenceId`): `this`

Defined in: [core/builders/order.builder.ts:179](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L179)

Add a reference ID for external tracking

#### Parameters

##### referenceId

`string`

External reference ID

#### Returns

`this`

Builder instance for chaining

***

### withState()

> **withState**(`state`): `this`

Defined in: [core/builders/order.builder.ts:200](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L200)

Set the order state. Use `'DRAFT'` when creating an order template that
will back a subscription phase.

#### Parameters

##### state

`OrderState`

#### Returns

`this`

***

### withTip()

> **withTip**(`amount`): `this`

Defined in: [core/builders/order.builder.ts:157](https://github.com/mbates/squareup/blob/main/src/core/builders/order.builder.ts#L157)

Add a tip to the order

#### Parameters

##### amount

`number`

Tip amount in cents

#### Returns

`this`

Builder instance for chaining
