[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / SquareClientConfig

# Interface: SquareClientConfig

Defined in: [core/client.ts:22](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L22)

Configuration options for the Square client

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [core/client.ts:26](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L26)

Square API access token

***

### defaultCurrency?

> `optional` **defaultCurrency?**: `string`

Defined in: [core/client.ts:43](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L43)

Default currency code

#### Default

```ts
'USD'
```

***

### environment?

> `optional` **environment?**: [`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

Defined in: [core/client.ts:32](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L32)

Square environment (sandbox or production)

#### Default

```ts
'sandbox'
```

***

### locationId?

> `optional` **locationId?**: `string`

Defined in: [core/client.ts:37](https://github.com/mbates/squareup/blob/main/src/core/client.ts#L37)

Default location ID for operations that require it
