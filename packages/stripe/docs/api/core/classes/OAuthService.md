[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / OAuthService

# Class: OAuthService

Defined in: [core/services/oauth.service.ts:128](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/oauth.service.ts#L128)

Connect OAuth service: finish the connect flow and disconnect accounts.

These calls authenticate with your platform's secret key, so they always go
out as the platform, even on a client returned by `forAccount`.

## Example

```typescript
// OAuth redirect handler. First check `state`: require a stored value,
// delete it (one use), then compare it with the query value. Then handle a
// deny (`error=access_denied`, no `code`) and require `code` to be a
// string. See docs/guides/core/connect.md.
const { stripeUserId } = await stripe.oauth.exchangeCode(code);
await db.saveRetailer({ stripeAccountId: stripeUserId });

// Later, act as the connected account
const retailer = stripe.forAccount(stripeUserId);
const { data: products } = await retailer.products.list({ active: true });
```

## Constructors

### Constructor

> **new OAuthService**(`getClient`, `defaultClientId?`): `OAuthService`

Defined in: [core/services/oauth.service.ts:135](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/oauth.service.ts#L135)

#### Parameters

##### getClient

() => `Stripe`

Returns an SDK client authenticated as the platform
  (no `Stripe-Account` header)

##### defaultClientId?

`string`

Connect client ID used by `deauthorize` when the
  call doesn't pass one

#### Returns

`OAuthService`

## Methods

### deauthorize()

> **deauthorize**(`stripeUserId`, `options?`): `Promise`\<`void`\>

Defined in: [core/services/oauth.service.ts:181](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/oauth.service.ts#L181)

Disconnect a connected account from your platform. Your platform can no
longer act on it afterwards.

#### Parameters

##### stripeUserId

`string`

##### options?

[`DeauthorizeOptions`](../interfaces/DeauthorizeOptions.md)

#### Returns

`Promise`\<`void`\>

#### Throws

When `stripeUserId` is missing, or no
  client ID is passed or configured

#### Throws

When Stripe does not confirm the account

#### Example

```typescript
await stripe.oauth.deauthorize(retailer.stripeAccountId);
```

***

### exchangeCode()

> **exchangeCode**(`code`): `Promise`\<[`ConnectedAccountGrant`](../interfaces/ConnectedAccountGrant.md)\>

Defined in: [core/services/oauth.service.ts:147](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/oauth.service.ts#L147)

Exchange the authorization `code` from the OAuth redirect for the
connected account's ID.

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ConnectedAccountGrant`](../interfaces/ConnectedAccountGrant.md)\>

#### Throws

When `code` is missing

#### Throws

When Stripe's response has no `stripe_user_id`
