[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / parseStripeError

# Function: parseStripeError()

> **parseStripeError**(`error`): [`StripeError`](../classes/StripeError.md)

Defined in: [core/errors.ts:263](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/errors.ts#L263)

Parse a Stripe SDK error (or any thrown value) into a typed exception.

Understands both `stripe-node` error instances and plain objects in
Stripe's API error shape. See the error guide for the full code map.

## Parameters

### error

`unknown`

## Returns

[`StripeError`](../classes/StripeError.md)
