[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / buildAuthorizeUrl

# Function: buildAuthorizeUrl()

> **buildAuthorizeUrl**(`options`): `string`

Defined in: [core/oauth.ts:60](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L60)

Build the URL that sends a merchant to Clover to authorize your app (v2
OAuth code flow, expiring tokens). Pure function, no network call.

Clover has no per-request scopes: the app's permissions are set in the
Developer Dashboard. The redirect carries `code`, `merchant_id` and `state`
query parameters; keep `merchant_id` for `createCloverClient`, since the
token response does not include it.

## Parameters

### options

[`BuildAuthorizeUrlOptions`](../interfaces/BuildAuthorizeUrlOptions.md)

## Returns

`string`

## Example

```typescript
const url = buildAuthorizeUrl({
  clientId: process.env.CLOVER_APP_ID!,
  environment: 'production',
  state: csrfToken, // random per attempt; store it server side to check in the callback
  redirectUri: 'https://example.com/clover/callback',
});
// redirect the merchant to `url`
```
