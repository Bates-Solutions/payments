# Changelog

## [0.2.0](https://github.com/Bates-Solutions/payments/compare/payments-core-v0.1.0...payments-core-v0.2.0) (2026-11-21)


### Features

* **payments-core:** add minorUnitExponent for the decimal places of each currency ([5945de8](https://github.com/Bates-Solutions/payments/commit/5945de8c1e7b32e874fb619047cace90836d605d))
* **payments-core:** currency rules in core, used by squareup and stripe (S10) ([380e212](https://github.com/Bates-Solutions/payments/commit/380e212949687baa98257b36f5fbeb6e7e576f18))

## 0.1.0 (2026-11-20)


### Features

* **payments-core:** add PaymentsError, requireNonEmpty and createIdempotencyKey ([f9b16ce](https://github.com/Bates-Solutions/payments/commit/f9b16ceb1abec248a544e8bd4203e77f1029c1ff))
* **payments-core:** add verifyTimestampedHmac, parseTimestampedSignatureHeader and fromBase64 ([bbda031](https://github.com/Bates-Solutions/payments/commit/bbda03188c35644e55261928ac12183ac1056dab))
* **payments-core:** match instanceof PaymentsError across copies of the package ([58d0b04](https://github.com/Bates-Solutions/payments/commit/58d0b0464c2b9b8e6bc40cde4bbdb60dd3797ce7))
* **payments-core:** match instanceof PaymentsError across copies of the package ([52cb68b](https://github.com/Bates-Solutions/payments/commit/52cb68b720de8f7a71a904994db1c7b2c8eb4251))
* **payments-core:** scaffold payments-core and spike the JSR workspace import (S7, part 1) ([d5e947b](https://github.com/Bates-Solutions/payments/commit/d5e947b97fa20114738ed0e835c6774b9a5409e4))
* **payments-core:** scaffold the shared core package with WebCrypto primitives ([4a579da](https://github.com/Bates-Solutions/payments/commit/4a579da5bc647d2b8f766f801e332b5f502023ba))
* PaymentsError base class and shared helpers in payments-core (S9) ([b3aeeb9](https://github.com/Bates-Solutions/payments/commit/b3aeeb9599de996f854a9f05c928072278e62cc5))
* verify webhook signatures with payments-core in all three providers (S8) ([da67efa](https://github.com/Bates-Solutions/payments/commit/da67efaadd3335f5ab1f8c843cef343df53c4c6e))


### Bug Fixes

* **payments-core:** address PR review feedback ([d371287](https://github.com/Bates-Solutions/payments/commit/d37128768f64e85ebe520145b984dd5103714fcb))
* **payments-core:** address PR review feedback ([75a1d08](https://github.com/Bates-Solutions/payments/commit/75a1d08853981dc92d93afbcce03c94e005b9dab))
* **payments-core:** coerce tolerance and clock like the old checks ([d9e1606](https://github.com/Bates-Solutions/payments/commit/d9e160655ce2e0e6d694318f5400f62a5611f8c3))
* **payments-core:** compare two strings as code units, not UTF-8 bytes ([9de6279](https://github.com/Bates-Solutions/payments/commit/9de627961da159e9b17a4675d483c9ac247d4941))
* **payments-core:** fail closed on unsupported compare inputs; build without type checks on install ([1843fcf](https://github.com/Bates-Solutions/payments/commit/1843fcff6e20fb0a6539a1537311bbfc6702d791))
