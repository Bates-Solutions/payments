/**
 * `@bates-solutions/stripe` — a TypeScript wrapper for the Stripe API.
 *
 * The package's main entrypoint. Exports `createStripeClient` / `StripeClient`
 * (one service per Stripe domain — `customers`, `checkout`, `billingPortal`,
 * `subscriptions`, `prices`, `products`, `invoices`, `payments`, `refunds`), the
 * normalized error hierarchy (`StripeError` + `parseStripeError`), and money /
 * idempotency utilities (`toMinor`, `fromMinor`, `formatMoney`,
 * `createIdempotencyKey`). Webhook helpers live in the
 * `@bates-solutions/stripe/server` entrypoint.
 *
 * @example
 * ```ts
 * import { createStripeClient } from '@bates-solutions/stripe';
 *
 * const stripe = createStripeClient({ apiKey: process.env.STRIPE_SECRET_KEY! });
 * const customer = await stripe.customers.create({ email: 'jane@example.com' });
 * ```
 *
 * @module
 */

// Core exports
export { createStripeClient, StripeClient } from './client.js';
export type { StripeClientConfig } from './client.js';

// Services
export { PaymentsService } from './services/payments.service.js';
export type { Payment, ListPaymentsOptions } from './services/payments.service.js';
export { CustomersService } from './services/customers.service.js';
export type {
  Customer,
  CustomerAddress,
  CreateCustomerOptions,
  UpdateCustomerOptions,
  ListCustomersOptions,
} from './services/customers.service.js';
export { RefundsService } from './services/refunds.service.js';
export type {
  Refund,
  RefundReason,
  CreateRefundOptions,
  ListRefundsOptions,
} from './services/refunds.service.js';
export { CheckoutService } from './services/checkout.service.js';
export type {
  CheckoutSession,
  CheckoutLineItem,
  CreateCheckoutSessionOptions,
  ListCheckoutSessionsOptions,
} from './services/checkout.service.js';
export { BillingPortalService } from './services/billing-portal.service.js';
export type {
  BillingPortalSession,
  CreatePortalSessionOptions,
} from './services/billing-portal.service.js';
export { SubscriptionsService, normalizeSubscription } from './services/subscriptions.service.js';
export type {
  Subscription,
  SubscriptionStatus,
  NormalizedSubscription,
  NormalizedSubscriptionItem,
  ListSubscriptionsOptions,
  CancelSubscriptionOptions,
} from './services/subscriptions.service.js';
export { PricesService } from './services/prices.service.js';
export type { Price, ListPricesOptions } from './services/prices.service.js';
export { ProductsService } from './services/products.service.js';
export type { Product, ListProductsOptions } from './services/products.service.js';
export { InvoicesService } from './services/invoices.service.js';
export type {
  Invoice,
  InvoiceItem,
  CreateInvoiceOptions,
  AddInvoiceItemOptions,
  ListInvoicesOptions,
} from './services/invoices.service.js';

// Errors
export {
  StripeError,
  StripeApiError,
  StripeAuthError,
  StripePaymentError,
  StripeValidationError,
  parseStripeError,
} from './errors.js';
export type { StripeErrorCode } from './errors.js';

// Utils
export {
  toMinor,
  fromMinor,
  formatMoney,
  createIdempotencyKey,
  fromUnixTime,
  resolveId,
} from './utils.js';
export type { Money } from './utils.js';

// Types
export type * from './types/index.js';
