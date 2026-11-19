[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / verifyTimestampedHmac

# Function: verifyTimestampedHmac()

> **verifyTimestampedHmac**(`payload`, `header`, `secret`, `options?`): `Promise`\<[`TimestampedHmacResult`](../type-aliases/TimestampedHmacResult.md)\>

Defined in: [crypto/timestamped.ts:105](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L105)

Verify a timestamped HMAC-SHA256 signature header, the scheme Stripe and
Clover use: the provider signs `${timestamp}.${payload}` and sends
`t=<timestamp>,v1=<hex signature>`.

Checks, in order: the header parses, one of the listed signatures matches
(each compared in constant time), and the timestamp is within the tolerance.
The caller checks for a missing payload, header or secret first and maps the
failure reason to its own messages; an empty `secret` makes the promise
reject (see [hmacSha256](hmacSha256.md)).

## Parameters

### payload

`string`

### header

`string`

### secret

`string`

### options?

[`VerifyTimestampedHmacOptions`](../interfaces/VerifyTimestampedHmacOptions.md)

## Returns

`Promise`\<[`TimestampedHmacResult`](../type-aliases/TimestampedHmacResult.md)\>

## Example

```typescript
const result = await verifyTimestampedHmac(rawBody, header, signingSecret);
if (!result.valid && result.reason === 'timestamp-outside-tolerance') {
  // reject a replayed webhook
}
```
