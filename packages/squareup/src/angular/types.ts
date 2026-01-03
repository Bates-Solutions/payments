/**
 * Angular-specific types for Square integration
 */

/**
 * Square module configuration
 */
export interface SquareConfig {
  /** Square application ID */
  applicationId: string;
  /** Square location ID */
  locationId: string;
  /** Environment (sandbox or production) */
  environment?: 'sandbox' | 'production';
  /** Access token for server-side operations */
  accessToken?: string;
  /** Default currency code */
  currency?: string;
}

/**
 * Square Web Payments SDK types
 */
export interface Payments {
  card(options?: CardOptions): Promise<Card>;
  googlePay(options: GooglePayOptions): Promise<GooglePay>;
  applePay(options: ApplePayOptions): Promise<ApplePay>;
}

export interface Card {
  attach(element: HTMLElement): Promise<void>;
  destroy(): Promise<void>;
  tokenize(): Promise<TokenResult>;
}

export interface GooglePay {
  attach(element: HTMLElement, options?: DigitalWalletOptions): Promise<void>;
  destroy(): Promise<void>;
  tokenize(): Promise<TokenResult>;
}

export interface ApplePay {
  attach(element: HTMLElement, options?: DigitalWalletOptions): Promise<void>;
  destroy(): Promise<void>;
  tokenize(): Promise<TokenResult>;
}

export interface CardOptions {
  style?: CardStyle;
}

export interface CardStyle {
  '.input-container'?: Record<string, string>;
  '.input-container.is-focus'?: Record<string, string>;
  '.input-container.is-error'?: Record<string, string>;
  '.message-text'?: Record<string, string>;
  '.message-icon'?: Record<string, string>;
  '.message-text.is-error'?: Record<string, string>;
  input?: Record<string, string>;
  'input.is-focus'?: Record<string, string>;
  'input::placeholder'?: Record<string, string>;
}

export interface GooglePayOptions {
  redirectURL?: string;
}

export interface ApplePayOptions {
  redirectURL?: string;
}

export interface DigitalWalletOptions {
  buttonColor?: 'default' | 'black' | 'white';
  buttonSizeMode?: 'fill' | 'static';
  buttonType?: 'long' | 'short';
}

export interface TokenResult {
  status: 'OK' | 'Cancel' | 'Error';
  token?: string;
  errors?: TokenError[];
}

export interface TokenError {
  type: string;
  message: string;
  field?: string;
}

/**
 * Injection token for Square configuration
 */
export const SQUARE_CONFIG = 'SQUARE_CONFIG';

/**
 * Payment request types
 */
export interface CreatePaymentRequest {
  sourceId: string;
  amount: number;
  currency?: string;
  idempotencyKey?: string;
  customerId?: string;
  orderId?: string;
  note?: string;
  referenceId?: string;
}

/**
 * Order types
 */
export interface CreateOrderRequest {
  lineItems?: OrderLineItem[];
  discounts?: OrderDiscount[];
  taxes?: OrderTax[];
  serviceCharges?: OrderServiceCharge[];
  fulfillments?: OrderFulfillment[];
  customerId?: string;
  referenceId?: string;
  note?: string;
}

export interface OrderLineItem {
  name?: string;
  quantity: string;
  catalogObjectId?: string;
  variationName?: string;
  basePriceMoney?: Money;
  note?: string;
}

export interface OrderDiscount {
  name?: string;
  percentage?: string;
  amountMoney?: Money;
  scope?: 'LINE_ITEM' | 'ORDER';
}

export interface OrderTax {
  name?: string;
  percentage?: string;
  scope?: 'LINE_ITEM' | 'ORDER';
}

export interface OrderServiceCharge {
  name?: string;
  percentage?: string;
  amountMoney?: Money;
}

export interface OrderFulfillment {
  type: 'PICKUP' | 'SHIPMENT' | 'DELIVERY';
  state?: string;
  pickupDetails?: PickupDetails;
  shipmentDetails?: ShipmentDetails;
}

export interface PickupDetails {
  recipient?: Recipient;
  scheduleType?: 'SCHEDULED' | 'ASAP';
  pickupAt?: string;
  note?: string;
}

export interface ShipmentDetails {
  recipient?: Recipient;
  carrier?: string;
  trackingNumber?: string;
}

export interface Recipient {
  displayName?: string;
  emailAddress?: string;
  phoneNumber?: string;
}

export interface Money {
  amount: number;
  currency?: string;
}

/**
 * Customer types
 */
export interface CreateCustomerRequest {
  givenName?: string;
  familyName?: string;
  companyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  address?: Address;
  note?: string;
  referenceId?: string;
}

export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  administrativeDistrictLevel1?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Catalog types
 */
export interface CatalogSearchRequest {
  textFilter?: string;
  categoryIds?: string[];
  stockLevels?: string[];
  enabledLocationIds?: string[];
  limit?: number;
  cursor?: string;
}
