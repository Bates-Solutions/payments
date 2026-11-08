[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CreateRefundOptions

# Interface: CreateRefundOptions

Defined in: core/services/refunds.service.ts:22

Options for creating a refund.

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: core/services/refunds.service.ts:26

Amount in cents. Omit for a full refund.

***

### chargeId

> **chargeId**: `string`

Defined in: core/services/refunds.service.ts:24

The charge to refund

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: core/services/refunds.service.ts:29

***

### reason?

> `optional` **reason?**: `string`

Defined in: core/services/refunds.service.ts:28

Reason for the refund
