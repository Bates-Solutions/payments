[**@bates-solutions/payments-core API Reference v0.1.0**](../../README.md)

***

[@bates-solutions/payments-core API Reference](../../README.md) / [index](../README.md) / TimestampedHmacResult

# Type Alias: TimestampedHmacResult

> **TimestampedHmacResult** = \{ `timestamp`: `number`; `valid`: `true`; \} \| \{ `reason`: [`TimestampedHmacFailure`](TimestampedHmacFailure.md); `valid`: `false`; \}

Defined in: [crypto/timestamped.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/payments-core/src/crypto/timestamped.ts#L42)

The result of [verifyTimestampedHmac](../functions/verifyTimestampedHmac.md).
