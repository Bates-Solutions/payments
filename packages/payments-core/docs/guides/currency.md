# Currency rules

`minorUnitExponent(currency)`, from `./currency`, gives the number of decimal places in a currency's minor unit, as ISO 4217 defines it. The payment APIs take amounts in minor units, so this is the power of ten between a major amount and what you send:

| Exponent | Currencies                                                            | 10.00 major is |
| -------- | --------------------------------------------------------------------- | -------------- |
| `0`      | `BIF CLP DJF GNF ISK JPY KMF KRW PYG RWF UGX UYI VND VUV XAF XOF XPF` | `10`           |
| `3`      | `BHD IQD JOD KWD LYD OMR TND`                                         | `10000`        |
| `4`      | `CLF UYW`                                                             | `100000`       |
| `2`      | every other code, including codes it does not know                    | `1000`         |

Codes match in any case. Only three ASCII letters count as a code: anything else, such as `'JPY '` or a code with a lookalike Unicode letter, gives `2`. A value that is not a non-empty string throws a `TypeError`.

```typescript
import { minorUnitExponent } from '@bates-solutions/payments-core/currency';

const minor = Math.round(amount * 10 ** minorUnitExponent(currency));
```

The provider packages build on this and keep their own rules on top:

- `@bates-solutions/stripe`'s `toMinor` follows Stripe's currency list where it differs from ISO 4217. It sends `ISK` and `UGX` as two-decimal values whose decimals are always `00`, treats `MGA` as zero-decimal, and sends `IQD`, `LYD`, `UYI`, `CLF` and `UYW` as two-decimal. It rounds three-decimal amounts to a multiple of 10.
- `@bates-solutions/squareup`'s `toCents` and `fromCents` use the exponent as it is.
- `@bates-solutions/clover` supports only two-decimal currencies, so its helpers multiply by 100.
