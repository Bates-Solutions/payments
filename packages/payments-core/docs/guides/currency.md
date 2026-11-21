# Currency rules

`minorUnitExponent(currency)`, from `./currency`, gives the number of decimal places in a currency's minor unit. The payment APIs take amounts in minor units, so this is the power of ten between a major amount and what you send:

| Exponent | Currencies                                                            | 10.00 major is |
| -------- | --------------------------------------------------------------------- | -------------- |
| `0`      | `BIF CLP DJF GNF ISK JPY KMF KRW MGA PYG RWF UGX VND VUV XAF XOF XPF` | `10`           |
| `3`      | `BHD JOD KWD OMR TND`                                                 | `10000`        |
| `2`      | every other code, including codes it does not know                    | `1000`         |

Codes match in any case. A value that is not a non-empty string throws a `TypeError`.

```typescript
import { minorUnitExponent } from '@bates-solutions/payments-core/currency';

const minor = Math.round(amount * 10 ** minorUnitExponent(currency));
```

The provider packages build on this and keep their own rules on top:

- `@bates-solutions/stripe`'s `toMinor` sends `ISK` and `UGX` as two-decimal values whose decimals are always `00`, as Stripe asks, and rounds three-decimal amounts to a multiple of 10.
- `@bates-solutions/squareup`'s `toCents` and `fromCents` use the exponent as it is.
- `@bates-solutions/clover` supports only two-decimal currencies, so its helpers multiply by 100.

`MGA` is listed as zero-decimal, as in Stripe's list, although ISO 4217 gives it an exponent of 2: its subunit is not used in practice.
