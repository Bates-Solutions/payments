[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareClientConfig

# Interface: SquareClientConfig

Defined in: [core/client.ts:21](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L21)

Configuration options for the Square client

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [core/client.ts:25](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L25)

Square API access token

***

### defaultCurrency?

> `optional` **defaultCurrency?**: `string`

Defined in: [core/client.ts:42](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L42)

Default currency code

#### Default

```ts
'USD'
```

***

### environment?

> `optional` **environment?**: [`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

Defined in: [core/client.ts:31](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L31)

Square environment (sandbox or production)

#### Default

```ts
'sandbox'
```

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [core/client.ts:36](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L36)

Default location ID for operations that require it
