[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CreateRefundOptions

# Interface: CreateRefundOptions

Defined in: [core/services/refunds.service.ts:22](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/refunds.service.ts#L22)

Options for creating a refund.

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: [core/services/refunds.service.ts:26](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/refunds.service.ts#L26)

Amount in cents. Omit for a full refund.

***

### chargeId

> **chargeId**: `string`

Defined in: [core/services/refunds.service.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/refunds.service.ts#L24)

The charge to refund

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/refunds.service.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/refunds.service.ts#L29)

***

### reason?

> `optional` **reason?**: `string`

Defined in: [core/services/refunds.service.ts:28](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/refunds.service.ts#L28)

Reason for the refund
