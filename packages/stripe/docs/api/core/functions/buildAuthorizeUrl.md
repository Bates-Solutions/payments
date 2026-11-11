[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / buildAuthorizeUrl

# Function: buildAuthorizeUrl()

> **buildAuthorizeUrl**(`options`): `string`

Defined in: [core/services/oauth.service.ts:91](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L91)

Build the URL that sends a user to Stripe to connect their existing Stripe
account to your platform (Connect OAuth, Standard accounts). Pure function,
no network call, so it works without an API key.

## Parameters

### options

[`BuildAuthorizeUrlOptions`](../interfaces/BuildAuthorizeUrlOptions.md)

## Returns

`string`

## Throws

When `clientId` or `state` is missing

## Example

```typescript
const url = buildAuthorizeUrl({
  clientId: process.env.STRIPE_CONNECT_CLIENT_ID!,
  state: csrfToken, // random per attempt; store it server side to check in the callback
  redirectUri: 'https://app.example.com/stripe/callback',
});
// redirect the user to `url`
```

## See

https://docs.stripe.com/connect/oauth-reference
