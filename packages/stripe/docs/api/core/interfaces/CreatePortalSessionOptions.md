[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreatePortalSessionOptions

# Interface: CreatePortalSessionOptions

Defined in: [core/services/billing-portal.service.ts:13](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/services/billing-portal.service.ts#L13)

Options for creating a Billing Portal session

## Properties

### configuration?

> `optional` **configuration?**: `string`

Defined in: [core/services/billing-portal.service.ts:19](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/services/billing-portal.service.ts#L19)

A specific portal configuration ID to use

***

### customerId

> **customerId**: `string`

Defined in: [core/services/billing-portal.service.ts:15](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/services/billing-portal.service.ts#L15)

Customer to open the portal for

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/billing-portal.service.ts:21](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/services/billing-portal.service.ts#L21)

Idempotency key (defaults to a generated UUID)

***

### returnUrl?

> `optional` **returnUrl?**: `string`

Defined in: [core/services/billing-portal.service.ts:17](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/core/services/billing-portal.service.ts#L17)

URL to return to after leaving the portal
