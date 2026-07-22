// Core exports
export { createCloverClient, CloverClient } from './client.js';
export type { CloverClientConfig } from './client.js';

// HTTP client (advanced use)
export { CloverHttp } from './http.js';
export type { CloverHttpConfig, RequestOptions } from './http.js';

// Services
export { PaymentsService } from './services/payments.service.js';
export type { Charge, CaptureChargeOptions } from './services/payments.service.js';
export { RefundsService } from './services/refunds.service.js';
export type { Refund, CreateRefundOptions } from './services/refunds.service.js';
export { CustomersService } from './services/customers.service.js';
export type {
  Customer,
  CreateCustomerOptions,
  UpdateCustomerOptions,
} from './services/customers.service.js';

// Errors
export {
  CloverError,
  CloverApiError,
  CloverAuthError,
  CloverPaymentError,
  CloverValidationError,
  parseCloverError,
  cloverErrorFromResponse,
} from './errors.js';
export type { CloverErrorCode } from './errors.js';

// Utils
export { toCents, fromCents, formatMoney, createIdempotencyKey } from './utils.js';
export type { Money } from './utils.js';

// Types
export type * from './types/index.js';
