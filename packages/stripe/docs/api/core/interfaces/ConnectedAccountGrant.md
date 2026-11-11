[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ConnectedAccountGrant

# Interface: ConnectedAccountGrant

Defined in: [core/services/oauth.service.ts:44](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L44)

Result of exchanging an authorization code.

Stripe is deprecating Connect OAuth access and refresh tokens, so they are
deliberately not returned: store `stripeUserId` and act on the account with
`stripe.forAccount(stripeUserId)`, which sends the `Stripe-Account` header.

## Properties

### livemode?

> `optional` **livemode?**: `boolean`

Defined in: [core/services/oauth.service.ts:50](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L50)

Whether the grant is for live mode

***

### scope?

> `optional` **scope?**: `string`

Defined in: [core/services/oauth.service.ts:48](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L48)

Scope that was granted

***

### stripeUserId

> **stripeUserId**: `string`

Defined in: [core/services/oauth.service.ts:46](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L46)

The connected account's ID (`acct_…`)
