[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / RequestOptions

# Interface: RequestOptions

Defined in: core/http.ts:37

Options for a single request.

## Properties

### body?

> `optional` **body?**: `unknown`

Defined in: core/http.ts:41

JSON request body

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: core/http.ts:43

Idempotency key, sent as the `idempotency-key` header

***

### query?

> `optional` **query?**: `Record`\<`string`, `string` \| `number` \| `undefined`\>

Defined in: core/http.ts:39

Query-string parameters
