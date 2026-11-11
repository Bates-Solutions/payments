[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / createCloverOAuthClient

# Function: createCloverOAuthClient()

> **createCloverOAuthClient**(`config`): [`CloverOAuthClient`](../classes/CloverOAuthClient.md)

Defined in: [core/oauth.ts:248](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L248)

Create an OAuth client for the app-credential endpoints.

## Parameters

### config

[`CloverOAuthClientConfig`](../interfaces/CloverOAuthClientConfig.md)

## Returns

[`CloverOAuthClient`](../classes/CloverOAuthClient.md)

## Example

```typescript
const oauth = createCloverOAuthClient({
  clientId: process.env.CLOVER_APP_ID!,
  clientSecret: process.env.CLOVER_APP_SECRET!,
  environment: 'production',
});
```
