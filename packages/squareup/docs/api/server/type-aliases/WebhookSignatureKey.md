[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / WebhookSignatureKey

# Type Alias: WebhookSignatureKey

> **WebhookSignatureKey** = `string` \| readonly `string`[]

Defined in: [squareup/src/server/types.ts:113](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L113)

A webhook signature key, or several. Pass a list while you rotate the key
(for example `[newKey, oldKey]`): a signature that matches any of them is
valid. Empty strings in the list are ignored.
