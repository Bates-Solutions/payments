import Stripe from 'stripe';
import type { StripeEnvironment } from './types/index.js';
import { PaymentsService } from './services/payments.service.js';
import { CustomersService } from './services/customers.service.js';
import { RefundsService } from './services/refunds.service.js';
import { CheckoutService } from './services/checkout.service.js';
import { BillingPortalService } from './services/billing-portal.service.js';
import { SubscriptionsService } from './services/subscriptions.service.js';
import { PricesService } from './services/prices.service.js';
import { ProductsService } from './services/products.service.js';
import { InvoicesService } from './services/invoices.service.js';
import { PaymentLinksService } from './services/payment-links.service.js';
import { OAuthService } from './services/oauth.service.js';
import { StripeValidationError } from './errors.js';

/**
 * Throw unless `accountId` looks like a connected account ID (`acct_…`).
 */
function assertAccountId(accountId: unknown, field: string): void {
  if (typeof accountId !== 'string' || !accountId.startsWith('acct_')) {
    throw new StripeValidationError(`${field} must be a connected account ID (acct_…)`, field);
  }
}

/**
 * The SDK constructor's config type. Spelled via the constructor rather than
 * `Stripe.StripeConfig`, which the SDK's types stopped exporting from the
 * `Stripe` namespace in 22.0.0 to 22.3.0.
 */
type StripeCtorConfig = NonNullable<ConstructorParameters<typeof Stripe>[1]>;

/**
 * Configuration options for the Stripe client
 */
export interface StripeClientConfig {
  /**
   * Stripe secret API key (e.g. `sk_test_…` or `sk_live_…`)
   */
  apiKey: string;

  /**
   * Pin a specific Stripe API version. Omit to use the version configured on
   * your Stripe account.
   */
  apiVersion?: string;

  /**
   * Number of times the Stripe SDK retries failed requests.
   * @default 1
   */
  maxNetworkRetries?: number;

  /**
   * Act as this connected account (`acct_…`) on every call: the SDK sends it
   * as the `Stripe-Account` header. Anything that isn't an `acct_…` ID throws
   * `StripeValidationError`. Usually you don't set this yourself; use
   * {@link StripeClient.forAccount} on your platform client instead.
   */
  stripeAccount?: string;

  /**
   * Your platform's Connect client ID (`ca_…`). Used as the default by
   * `oauth.deauthorize`.
   */
  connectClientId?: string;
}

/**
 * Main Stripe client wrapper.
 *
 * @example
 * ```typescript
 * const stripe = createStripeClient({
 *   apiKey: process.env.STRIPE_SECRET_KEY!,
 * });
 *
 * // Create a payment
 * const payment = await stripe.payments.create({
 *   amount: 1000, // $10.00
 *   currency: 'usd',
 *   paymentMethod: 'pm_card_visa',
 *   confirm: true,
 * });
 * ```
 */
export class StripeClient {
  private readonly client: Stripe;
  private readonly config: StripeClientConfig;
  private readonly stripeConfig: Stripe.StripeConfig;
  private readonly environmentValue: StripeEnvironment;
  private platformClient?: Stripe;

  public readonly payments: PaymentsService;
  public readonly customers: CustomersService;
  public readonly refunds: RefundsService;
  public readonly checkout: CheckoutService;
  public readonly billingPortal: BillingPortalService;
  public readonly subscriptions: SubscriptionsService;
  public readonly prices: PricesService;
  public readonly products: ProductsService;
  public readonly invoices: InvoicesService;
  public readonly paymentLinks: PaymentLinksService;
  public readonly oauth: OAuthService;

  constructor(config: StripeClientConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required to create a Stripe client');
    }

    // Match the `_live_` segment so restricted keys (`rk_live_…`) are classified
    // correctly, not just standard secret keys (`sk_live_…`).
    this.environmentValue = config.apiKey.includes('_live_') ? 'live' : 'test';

    const stripeConfig: StripeCtorConfig = {
      maxNetworkRetries: config.maxNetworkRetries ?? 1,
      typescript: true,
    };
    if (config.apiVersion) {
      stripeConfig.apiVersion = config.apiVersion as StripeCtorConfig['apiVersion'];
    }

    if (config.stripeAccount !== undefined) {
      assertAccountId(config.stripeAccount, 'stripeAccount');
    }

    this.config = config;
    this.stripeConfig = stripeConfig;
    this.client = new Stripe(
      config.apiKey,
      config.stripeAccount ? { ...stripeConfig, stripeAccount: config.stripeAccount } : stripeConfig
    );

    // Initialize services
    this.payments = new PaymentsService(this.client);
    this.customers = new CustomersService(this.client);
    this.refunds = new RefundsService(this.client);
    this.checkout = new CheckoutService(this.client);
    this.billingPortal = new BillingPortalService(this.client);
    this.subscriptions = new SubscriptionsService(this.client);
    this.prices = new PricesService(this.client);
    this.products = new ProductsService(this.client);
    this.invoices = new InvoicesService(this.client);
    this.paymentLinks = new PaymentLinksService(this.client);
    this.oauth = new OAuthService(() => this.getPlatformClient(), config.connectClientId);
  }

  /**
   * Return a client that acts as a connected account. Every call it makes
   * sends `Stripe-Account: <accountId>`, so all services work unchanged on
   * that account. The original client is not modified.
   *
   * @param accountId - Connected account ID (`acct_…`), e.g. the
   *   `stripeUserId` from `oauth.exchangeCode`
   * @throws {StripeValidationError} When `accountId` is not an `acct_…` ID
   *
   * @example
   * ```typescript
   * const retailer = stripe.forAccount('acct_123');
   * const { data: products } = await retailer.products.list({ active: true });
   * ```
   */
  forAccount(accountId: string): StripeClient {
    assertAccountId(accountId, 'accountId');
    return new StripeClient({ ...this.config, stripeAccount: accountId });
  }

  /**
   * The connected account this client acts as, or `undefined` for the
   * platform account.
   */
  get accountId(): string | undefined {
    return this.config.stripeAccount;
  }

  /**
   * SDK client without a `Stripe-Account` header, for calls that must run as
   * the platform (Connect OAuth). Same as `sdk` on a platform client.
   */
  private getPlatformClient(): Stripe {
    if (!this.config.stripeAccount) {
      return this.client;
    }
    this.platformClient ??= new Stripe(this.config.apiKey, this.stripeConfig);
    return this.platformClient;
  }

  /**
   * Get the underlying Stripe SDK client.
   * Use this for advanced operations not covered by the wrapper.
   */
  get sdk(): Stripe {
    return this.client;
  }

  /**
   * The environment this client operates in, derived from the API key.
   */
  get environment(): StripeEnvironment {
    return this.environmentValue;
  }
}

/**
 * Create a new Stripe client instance.
 *
 * @param config - Client configuration
 * @returns Configured Stripe client
 *
 * @example
 * ```typescript
 * const stripe = createStripeClient({
 *   apiKey: process.env.STRIPE_SECRET_KEY!,
 * });
 * ```
 */
export function createStripeClient(config: StripeClientConfig): StripeClient {
  return new StripeClient(config);
}
