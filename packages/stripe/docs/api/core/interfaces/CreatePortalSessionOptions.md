[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreatePortalSessionOptions

# Interface: CreatePortalSessionOptions

Defined in: core/services/billing-portal.service.ts:13

Options for creating a Billing Portal session

## Properties

### configuration?

> `optional` **configuration?**: `string`

Defined in: core/services/billing-portal.service.ts:19

A specific portal configuration ID to use

***

### customerId

> **customerId**: `string`

Defined in: core/services/billing-portal.service.ts:15

Customer to open the portal for

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: core/services/billing-portal.service.ts:21

Idempotency key (defaults to a generated UUID)

***

### returnUrl?

> `optional` **returnUrl?**: `string`

Defined in: core/services/billing-portal.service.ts:17

URL to return to after leaving the portal
