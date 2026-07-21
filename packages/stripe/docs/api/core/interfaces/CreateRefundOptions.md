[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateRefundOptions

# Interface: CreateRefundOptions

Defined in: [core/services/refunds.service.ts:21](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L21)

Options for creating a refund.

Provide either `paymentIntentId` or `chargeId`.

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: [core/services/refunds.service.ts:29](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L29)

Amount to refund in the smallest currency unit. Omit for a full refund.

***

### chargeId?

> `optional` **chargeId?**: `string`

Defined in: [core/services/refunds.service.ts:25](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L25)

Charge to refund

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/refunds.service.ts:33](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L33)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/refunds.service.ts:32](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L32)

***

### paymentIntentId?

> `optional` **paymentIntentId?**: `string`

Defined in: [core/services/refunds.service.ts:23](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L23)

PaymentIntent to refund

***

### reason?

> `optional` **reason?**: [`RefundReason`](../type-aliases/RefundReason.md)

Defined in: [core/services/refunds.service.ts:31](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/refunds.service.ts#L31)

Reason for the refund
