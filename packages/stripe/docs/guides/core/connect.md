# Connected Accounts (Connect)

Stripe [Connect](https://docs.stripe.com/connect) lets your platform act on other businesses' Stripe accounts. The typical flow for a Standard account:

1. Send the user to Stripe with `buildAuthorizeUrl`.
2. In your redirect handler, check `state`, then call `stripe.oauth.exchangeCode(code)` to get the connected account's ID.
3. Store that ID and act on the account with `stripe.forAccount(id)`.

Stripe is deprecating the access and refresh tokens Connect OAuth used to return, so this library never returns them. Everything runs off the account ID and the `Stripe-Account` header ([Making API calls for connected accounts](https://docs.stripe.com/connect/authentication)).

## 1. Build the authorize URL

`buildAuthorizeUrl` is a pure function, so it needs no client or API key:

```typescript
import { buildAuthorizeUrl } from '@bates-solutions/stripe';

const url = buildAuthorizeUrl({
  clientId: process.env.STRIPE_CONNECT_CLIENT_ID!, // ca_… from Dashboard → Connect settings
  state: csrfToken, // unguessable; check it in the callback
  redirectUri: 'https://app.example.com/stripe/callback',
});
// redirect the user to `url`
```

| Option          | Type                          | Description                                                        |
| --------------- | ----------------------------- | ------------------------------------------------------------------ |
| `clientId`      | `string`                      | **Required.** Your platform's Connect client ID (`ca_…`).          |
| `state`         | `string`                      | **Required.** CSRF token, returned unchanged on the redirect.      |
| `scope`         | `'read_write' \| 'read_only'` | Defaults to `read_write`.                                          |
| `redirectUri`   | `string`                      | Must match a redirect URI in your Connect settings.                |
| `stripeLanding` | `'login' \| 'register'`       | Show the sign-in page or the sign-up page first.                   |
| `alwaysPrompt`  | `boolean`                     | Show the account picker even if the user already connected.        |
| `email`         | `string`                      | Prefill the email on the sign-up form.                             |

## 2. Exchange the code

```typescript
// GET /stripe/callback?code=ac_…&state=…
if (req.query.state !== session.csrfToken) throw new Error('bad state');

const { stripeUserId, scope, livemode } = await stripe.oauth.exchangeCode(req.query.code);
await db.saveRetailer({ stripeAccountId: stripeUserId });
```

The redirect can also carry `error` and `error_description` instead of a code when the user declines; handle those before calling `exchangeCode`.

## 3. Act as the connected account

`forAccount` returns a new client whose every call sends `Stripe-Account: <id>`. All services work unchanged, and the platform client is not modified:

```typescript
const retailer = stripe.forAccount(retailerRow.stripeAccountId);

const product = await retailer.products.create({ name: 'Sourdough loaf' });
const { data: sessions } = await retailer.checkout.list({ limit: 20 });

retailer.accountId; // 'acct_…'
stripe.accountId;   // undefined (the platform)
```

You can also pass `stripeAccount` to `createStripeClient` directly, but `forAccount` on one platform client is usually neater.

## Disconnect an account

```typescript
const stripe = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  connectClientId: process.env.STRIPE_CONNECT_CLIENT_ID!,
});

await stripe.oauth.deauthorize(retailerRow.stripeAccountId);
// or pass the client ID per call:
await stripe.oauth.deauthorize(accountId, { clientId: 'ca_…' });
```

`deauthorize` throws `StripeError` if Stripe does not echo back the account it disconnected.

`oauth` calls always run as the platform, even on a client from `forAccount`.

## Webhooks from connected accounts

Events sent to a Connect webhook endpoint carry the account they happened on. `getAccountId(event)` returns it (or `undefined` for platform events):

```typescript
import { createWebhookHandler, getAccountId } from '@bates-solutions/stripe/server';

const handler = createWebhookHandler({
  signingSecret: Deno.env.get('STRIPE_CONNECT_WEBHOOK_SECRET')!,
  handlers: {
    'checkout.session.completed': async (event) => {
      const accountId = getAccountId(event);
      if (accountId) await recordSale(accountId, event.data.object);
    },
  },
});
```

Connect endpoints have their own signing secret, separate from your platform endpoint's.
