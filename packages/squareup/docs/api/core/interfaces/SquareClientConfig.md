[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareClientConfig

# Interface: SquareClientConfig

Defined in: [squareup/src/core/client.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L25)

Configuration options for the Square client

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [squareup/src/core/client.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L29)

Square API access token

***

### defaultCurrency?

> `optional` **defaultCurrency?**: `string`

Defined in: [squareup/src/core/client.ts:46](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L46)

Default currency code

#### Default

```ts
'USD'
```

***

### environment?

> `optional` **environment?**: [`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

Defined in: [squareup/src/core/client.ts:35](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L35)

Square environment (sandbox or production)

#### Default

```ts
'sandbox'
```

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [squareup/src/core/client.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/client.ts#L40)

Default location ID for operations that require it
