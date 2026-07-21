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
export { toMinor, fromMinor, formatMoney, createIdempotencyKey } from './utils.js';
export type { Money } from './utils.js';

// Types
export type * from './types/index.js';
