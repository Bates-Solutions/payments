[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / fromBase64

# Function: fromBase64()

> **fromBase64**(`text`): `Uint8Array`

Defined in: [crypto/base64.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/base64.ts#L27)

Decode base64 the way Node's `Buffer.from(text, 'base64')` does, with no Node
built-ins: standard or URL-safe alphabet, padding optional, characters outside
the alphabet (whitespace included) skipped, decoding stops at the first `=`,
and leftover bits that don't make a whole byte are dropped.

That leniency is deliberate: it lets a WebCrypto signature check accept
exactly the inputs a `node:crypto` one that decodes with `Buffer` accepts.
Never fails; text with no base64 characters decodes to no bytes.

## Parameters

### text

`string`

## Returns

`Uint8Array`

## Example

```typescript
fromBase64('aGk=');  // Uint8Array [104, 105]
fromBase64('aGk');   // the same: padding is optional
```
