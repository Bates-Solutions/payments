import Stripe from 'stripe';
import type { StripeEnvironment } from './types/index.js';
import { PaymentsService } from './services/payments.service.js';
import { CustomersService } from './services/customers.service.js';
import { RefundsService } from './services/refunds.service.js';

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
  private readonly environmentValue: StripeEnvironment;

  public readonly payments: PaymentsService;
  public readonly customers: CustomersService;
  public readonly refunds: RefundsService;

  constructor(config: StripeClientConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required to create a Stripe client');
    }

    this.environmentValue = config.apiKey.startsWith('sk_live_') ? 'live' : 'test';

    const stripeConfig: Stripe.StripeConfig = {
      maxNetworkRetries: config.maxNetworkRetries ?? 1,
      typescript: true,
    };
    if (config.apiVersion) {
      stripeConfig.apiVersion = config.apiVersion as Stripe.StripeConfig['apiVersion'];
    }

    this.client = new Stripe(config.apiKey, stripeConfig);

    // Initialize services
    this.payments = new PaymentsService(this.client);
    this.customers = new CustomersService(this.client);
    this.refunds = new RefundsService(this.client);
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
