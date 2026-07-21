[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateRefundOptions

# Interface: CreateRefundOptions

<<<<<<< HEAD
Defined in: [core/services/refunds.service.ts:21](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L21)
=======
Defined in: [core/services/refunds.service.ts:21](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L21)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Options for creating a refund.

Provide either `paymentIntentId` or `chargeId`.

## Properties

### amount?

> `optional` **amount?**: `number`

<<<<<<< HEAD
Defined in: [core/services/refunds.service.ts:29](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L29)
=======
Defined in: [core/services/refunds.service.ts:29](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L29)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Amount to refund in the smallest currency unit. Omit for a full refund.

***

### chargeId?

> `optional` **chargeId?**: `string`

<<<<<<< HEAD
Defined in: [core/services/refunds.service.ts:25](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L25)
=======
Defined in: [core/services/refunds.service.ts:25](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L25)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Charge to refund

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

<<<<<<< HEAD
Defined in: [core/services/refunds.service.ts:33](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L33)
=======
Defined in: [core/services/refunds.service.ts:33](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L33)
>>>>>>> feat/edge-webhook-and-subscription-helpers

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

<<<<<<< HEAD
Defined in: [core/services/refunds.service.ts:32](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L32)
=======
Defined in: [core/services/refunds.service.ts:32](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L32)
>>>>>>> feat/edge-webhook-and-subscription-helpers

***

### paymentIntentId?

> `optional` **paymentIntentId?**: `string`

<<<<<<< HEAD
Defined in: [core/services/refunds.service.ts:23](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L23)
=======
Defined in: [core/services/refunds.service.ts:23](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L23)
>>>>>>> feat/edge-webhook-and-subscription-helpers

PaymentIntent to refund

***

### reason?

> `optional` **reason?**: [`RefundReason`](../type-aliases/RefundReason.md)

<<<<<<< HEAD
Defined in: [core/services/refunds.service.ts:31](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/services/refunds.service.ts#L31)
=======
Defined in: [core/services/refunds.service.ts:31](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L31)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Reason for the refund
