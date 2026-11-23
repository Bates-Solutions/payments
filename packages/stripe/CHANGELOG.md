# Changelog

## [2.2.1](https://github.com/Bates-Solutions/payments/compare/stripe-v2.2.0...stripe-v2.2.1) (2026-11-23)


### Bug Fixes

* **stripe:** keep stripe-node's request id prefix out of error messages ([6b10953](https://github.com/Bates-Solutions/payments/commit/6b109532d27d16b208cae397ef9a40782147040f))

## [2.2.0](https://github.com/Bates-Solutions/payments/compare/stripe-v2.1.1...stripe-v2.2.0) (2026-11-21)


### Features

* **payments-core:** currency rules in core, used by squareup and stripe (S10) ([380e212](https://github.com/Bates-Solutions/payments/commit/380e212949687baa98257b36f5fbeb6e7e576f18))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @bates-solutions/payments-core bumped from ^0.1.0 to ^0.2.0

## [2.1.1](https://github.com/Bates-Solutions/payments/compare/stripe-v2.1.0...stripe-v2.1.1) (2026-11-21)


### Documentation

* **stripe:** document every export on JSR, and link the JSR API reference ([3b1a36a](https://github.com/Bates-Solutions/payments/commit/3b1a36aba70a61f265ba739ccc8b9b5e0d299ee4))

## [2.1.0](https://github.com/Bates-Solutions/payments/compare/stripe-v2.0.0...stripe-v2.1.0) (2026-11-20)


### Features

* **payments-core:** match instanceof PaymentsError across copies of the package ([58d0b04](https://github.com/Bates-Solutions/payments/commit/58d0b0464c2b9b8e6bc40cde4bbdb60dd3797ce7))
* PaymentsError base class and shared helpers in payments-core (S9) ([b3aeeb9](https://github.com/Bates-Solutions/payments/commit/b3aeeb9599de996f854a9f05c928072278e62cc5))
* **squareup,stripe,clover:** extend PaymentsError and use core helpers ([1eca758](https://github.com/Bates-Solutions/payments/commit/1eca7583a03d2f3ce65c438afabcbb96c29e4973))
* verify webhook signatures with payments-core in all three providers (S8) ([da67efa](https://github.com/Bates-Solutions/payments/commit/da67efaadd3335f5ab1f8c843cef343df53c4c6e))


### Bug Fixes

* **stripe:** keep 2.0.0 version, peer range and repo URLs lost in the re-import merge ([2766d39](https://github.com/Bates-Solutions/payments/commit/2766d3989ece1a70b0b9119842d02c9036434784))
