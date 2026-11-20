[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / parseStripeError

# Function: parseStripeError()

> **parseStripeError**(`error`): [`StripeError`](../classes/StripeError.md)

Defined in: [stripe/src/core/errors.ts:257](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/errors.ts#L257)

Parse a Stripe SDK error (or any thrown value) into a typed exception.

Understands both `stripe-node` error instances and plain objects in
Stripe's API error shape. See the error guide for the full code map.

## Parameters

### error

`unknown`

## Returns

[`StripeError`](../classes/StripeError.md)
