[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / parseCloverError

# Function: parseCloverError()

> **parseCloverError**(`error`): [`CloverError`](../classes/CloverError.md)

Defined in: core/errors.ts:180

Parse any thrown value into a typed Clover error.

Passes through errors this library already produced (including those thrown
by the HTTP client) and wraps everything else — e.g. a `fetch` network
failure — as a base [CloverError](../classes/CloverError.md).

## Parameters

### error

`unknown`

## Returns

[`CloverError`](../classes/CloverError.md)
