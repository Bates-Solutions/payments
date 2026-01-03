// Core exports
export { createSquareClient, SquareClient } from './client.js';
export type { SquareClientConfig } from './client.js';

// Services
export { PaymentsService } from './services/payments.service.js';
export { OrdersService } from './services/orders.service.js';
export { CustomersService } from './services/customers.service.js';
export { CatalogService } from './services/catalog.service.js';
export { InventoryService } from './services/inventory.service.js';
export { SubscriptionsService } from './services/subscriptions.service.js';
export { InvoicesService } from './services/invoices.service.js';
export { LoyaltyService } from './services/loyalty.service.js';

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
