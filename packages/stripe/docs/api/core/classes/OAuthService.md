[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / OAuthService

# Class: OAuthService

Defined in: [stripe/src/core/services/oauth.service.ts:127](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L127)

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

Defined in: [stripe/src/core/services/oauth.service.ts:134](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L134)

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

Defined in: [stripe/src/core/services/oauth.service.ts:180](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L180)

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

Defined in: [stripe/src/core/services/oauth.service.ts:146](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L146)

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
