[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CurrencyCode

# Type Alias: CurrencyCode

> **CurrencyCode** = `"usd"` \| `"cad"` \| `"gbp"` \| `"eur"` \| `"aud"` \| `"jpy"` \| `string` & `Record`\<`never`, `never`\>

Defined in: [core/types/index.ts:20](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/types/index.ts#L20)

A Stripe currency code.

Stripe currency codes are lowercase ISO 4217 (e.g. `usd`). The listed codes
are a representative subset offered for autocomplete; any other ISO code
Stripe supports (e.g. `krw`, `kwd`, `isk`) is accepted too. The money
helpers (`toMinor`, `fromMinor`, `formatMoney`) match codes
case-insensitively.

## See

https://docs.stripe.com/currencies
