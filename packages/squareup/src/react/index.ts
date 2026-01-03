// Provider and context
export { SquareProvider, useSquare, SquareContext } from './SquareProvider.js';
export type { SquareProviderProps } from './SquareProvider.js';

// Hooks
export {
  useSquarePayment,
  usePayments,
  useOrders,
  useCustomers,
  useCatalog,
} from './hooks/index.js';
export type {
  UseSquarePaymentOptions,
  CreatePaymentInput,
  PaymentResponse,
  UsePaymentsOptions,
  UsePaymentsReturn,
  OrderLineItemInput,
  CreateOrderInput,
  OrderResponse,
  UseOrdersOptions,
  UseOrdersReturn,
  CustomerAddressInput,
  CustomerInput,
  CustomerResponse,
  UseCustomersOptions,
  UseCustomersReturn,
  CatalogObjectType,
  CatalogItemResponse,
  CatalogSearchOptions,
  UseCatalogOptions,
  UseCatalogReturn,
} from './hooks/index.js';

// Components
export { CardInput, PaymentButton } from './components/index.js';
export type {
  CardInputProps,
  CardInputHandle,
  PaymentMethodType,
  PaymentButtonProps,
} from './components/index.js';

// Types
export type {
  SquareProviderConfig,
  SquareContextValue,
  UseSquarePaymentState,
  UseSquarePaymentReturn,
  MutationState,
  QueryState,
  // Web Payments SDK types
  Payments,
  Card,
  GooglePay,
  ApplePay,
  GiftCard,
  Ach,
  CardOptions,
  CardStyle,
  DigitalWalletOptions,
  TokenResult,
  TokenError,
  VerificationDetails,
  VerificationResult,
} from './types.js';
