[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / getVerificationCode

# Function: getVerificationCode()

> **getVerificationCode**(`event`): `string` \| `undefined`

Defined in: server/webhook.ts:150

The verification code Clover sends when first validating a webhook URL.

Clover POSTs `{ "verificationCode": "..." }` (with no signature) to confirm
the endpoint; respond `200` to complete setup.

## Parameters

### event

[`WebhookEvent`](../interfaces/WebhookEvent.md)

## Returns

`string` \| `undefined`
