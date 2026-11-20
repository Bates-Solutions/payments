[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ConnectedAccountGrant

# Interface: ConnectedAccountGrant

Defined in: [stripe/src/core/services/oauth.service.ts:45](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L45)

Result of exchanging an authorization code.

Stripe is deprecating Connect OAuth access and refresh tokens, so they are
deliberately not returned: store `stripeUserId` and act on the account with
`stripe.forAccount(stripeUserId)`, which sends the `Stripe-Account` header.

## Properties

### livemode?

> `optional` **livemode?**: `boolean`

Defined in: [stripe/src/core/services/oauth.service.ts:51](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L51)

Whether the grant is for live mode

***

### scope?

> `optional` **scope?**: `string`

Defined in: [stripe/src/core/services/oauth.service.ts:49](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L49)

Scope that was granted

***

### stripeUserId

> **stripeUserId**: `string`

Defined in: [stripe/src/core/services/oauth.service.ts:47](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L47)

The connected account's ID (`acct_…`)
