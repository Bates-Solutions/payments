// Core exports
export { createSquareClient, SquareClient } from './client.js';
export type { SquareClientConfig } from './client.js';

// Services
export { PaymentsService } from './services/payments.service.js';
export { OrdersService } from './services/orders.service.js';

// Builders
export { OrderBuilder } from './builders/order.builder.js';

// Errors
export {
  SquareError,
  SquareApiError,
  SquareAuthError,
  SquarePaymentError,
  SquareValidationError,
} from './errors.js';
export type { SquareErrorCode } from './errors.js';

// Utils
export { toCents, fromCents, formatMoney, createIdempotencyKey } from './utils.js';
export type { Money } from './utils.js';

// Types
export type * from './types/index.js';
