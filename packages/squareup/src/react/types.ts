import type { SquareEnvironment, CurrencyCode } from '../core/types/index.js';

/**
 * Square Provider configuration
 */
export interface SquareProviderConfig {
  /** Square Application ID */
  applicationId: string;
  /** Square Location ID */
  locationId: string;
  /** Environment (sandbox or production) */
  environment?: SquareEnvironment;
  /** Access token for server-side operations (optional, for SSR) */
  accessToken?: string;
  /** Default currency */
  currency?: CurrencyCode;
}

/**
 * Square context value
 */
export interface SquareContextValue {
  /** Configuration */
  config: SquareProviderConfig;
  /** Whether the Web Payments SDK is loaded */
  sdkLoaded: boolean;
  /** Square Payments instance */
  payments: Payments | null;
  /** Error if SDK failed to load */
  error: Error | null;
}

/**
 * Web Payments SDK types
 * These are simplified types for the Square Web Payments SDK
 */
export interface Payments {
  card: (options?: CardOptions) => Promise<Card>;
  googlePay: (options: GooglePayOptions) => Promise<GooglePay>;
  applePay: (options: ApplePayOptions) => Promise<ApplePay>;
  giftCard: (options?: GiftCardOptions) => Promise<GiftCard>;
  ach: (options?: AchOptions) => Promise<Ach>;
  verifyBuyer: (
    sourceId: string,
    verificationDetails: VerificationDetails
  ) => Promise<VerificationResult>;
}

export interface Card {
  attach: (element: HTMLElement | string) => Promise<void>;
  detach: () => Promise<void>;
  destroy: () => Promise<void>;
  tokenize: () => Promise<TokenResult>;
  configure: (options: CardOptions) => Promise<void>;
  addEventListener: (event: CardEventType, callback: CardEventCallback) => void;
  removeEventListener: (event: CardEventType, callback: CardEventCallback) => void;
}

export interface GooglePay {
  attach: (element: HTMLElement | string, options?: DigitalWalletOptions) => Promise<void>;
  destroy: () => Promise<void>;
  tokenize: () => Promise<TokenResult>;
}

export interface ApplePay {
  attach: (element: HTMLElement | string, options?: DigitalWalletOptions) => Promise<void>;
  destroy: () => Promise<void>;
  tokenize: () => Promise<TokenResult>;
}

export interface GiftCard {
  attach: (element: HTMLElement | string) => Promise<void>;
  destroy: () => Promise<void>;
  tokenize: () => Promise<TokenResult>;
}

export interface Ach {
  tokenize: (options: AchTokenizeOptions) => Promise<TokenResult>;
}

export interface CardOptions {
  style?: CardStyle;
  postalCode?: string;
}

export interface CardStyle {
  '.input-container'?: CSSStyleDeclaration;
  '.input-container.is-focus'?: CSSStyleDeclaration;
  '.input-container.is-error'?: CSSStyleDeclaration;
  '.message-text'?: CSSStyleDeclaration;
  '.message-icon'?: CSSStyleDeclaration;
  '.message-text.is-error'?: CSSStyleDeclaration;
  input?: CSSStyleDeclaration;
  'input::placeholder'?: CSSStyleDeclaration;
  'input.is-error'?: CSSStyleDeclaration;
}

export interface GooglePayOptions {
  redirectURL?: string;
}

export interface ApplePayOptions {
  redirectURL?: string;
}

export interface GiftCardOptions {
  style?: CardStyle;
}

export interface AchOptions {
  redirectURL?: string;
}

export interface AchTokenizeOptions {
  accountHolderName: string;
  intent?: 'CHARGE' | 'STORE';
}

export interface DigitalWalletOptions {
  buttonColor?: 'default' | 'black' | 'white';
  buttonSizeMode?: 'fill' | 'static';
  buttonType?: 'buy' | 'donate' | 'plain' | 'order' | 'pay' | 'tip';
}

export interface TokenResult {
  status: 'OK' | 'Cancel' | 'Error';
  token?: string;
  errors?: TokenError[];
  details?: {
    card?: {
      brand: string;
      lastFour: string;
      expMonth: number;
      expYear: number;
    };
    billing?: {
      postalCode?: string;
    };
    method?: 'Card' | 'GooglePay' | 'ApplePay' | 'GiftCard' | 'Ach';
  };
}

export interface TokenError {
  type: string;
  message: string;
  field?: string;
}

export interface VerificationDetails {
  amount: string;
  currencyCode: string;
  intent: 'CHARGE' | 'STORE';
  billingContact?: {
    addressLines?: string[];
    city?: string;
    countryCode?: string;
    email?: string;
    familyName?: string;
    givenName?: string;
    phone?: string;
    postalCode?: string;
    state?: string;
  };
}

export interface VerificationResult {
  token: string;
  userChallenged: boolean;
}

export type CardEventType =
  | 'ready'
  | 'focusClassAdded'
  | 'focusClassRemoved'
  | 'errorClassAdded'
  | 'errorClassRemoved'
  | 'cardBrandChanged'
  | 'postalCodeChanged'
  | 'escape'
  | 'submit';

export type CardEventCallback = (event: CardEvent) => void;

export interface CardEvent {
  cardBrand?: string;
  postalCodeValue?: string;
}

/**
 * Hook state types
 */
export interface UseSquarePaymentState {
  ready: boolean;
  error: Error | null;
  loading: boolean;
}

export interface UseSquarePaymentReturn extends UseSquarePaymentState {
  cardRef: React.RefCallback<HTMLDivElement>;
  tokenize: () => Promise<string>;
  card: Card | null;
}

/**
 * Mutation hook state
 */
export interface MutationState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Query hook state
 */
export interface QueryState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
}
