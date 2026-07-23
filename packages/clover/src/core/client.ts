import type { CloverEnvironment } from './types/index.js';
import { CloverHttp } from './http.js';
import { PaymentsService } from './services/payments.service.js';
import { RefundsService } from './services/refunds.service.js';
import { CustomersService } from './services/customers.service.js';

/**
 * Configuration options for the Clover client.
 */
export interface CloverClientConfig {
  /** Clover API token (OAuth access token or API key) */
  apiToken: string;
  /**
   * Merchant id. Required for platform (`/v3/merchants/{mId}`) operations such
   * as `customers`; not needed for Ecommerce charges/refunds.
   */
  merchantId?: string;
  /**
   * Environment.
   * @default 'sandbox'
   */
  environment?: CloverEnvironment;
  /** Override the `fetch` implementation (mainly for tests). */
  fetchImpl?: typeof fetch;
}

/**
 * Main Clover client wrapper.
 *
 * @example
 * ```typescript
 * const clover = createCloverClient({
 *   apiToken: process.env.CLOVER_API_TOKEN!,
 *   merchantId: process.env.CLOVER_MERCHANT_ID,
 *   environment: 'sandbox',
 * });
 *
 * const charge = await clover.payments.create({
 *   amount: 1000, // $10.00
 *   source: 'clv_1TSTStok...',
 * });
 * ```
 */
export class CloverClient {
  private readonly http: CloverHttp;
  private readonly environmentValue: CloverEnvironment;

  public readonly payments: PaymentsService;
  public readonly refunds: RefundsService;
  public readonly customers: CustomersService;

  constructor(config: CloverClientConfig) {
    if (!config.apiToken) {
      throw new Error('apiToken is required to create a Clover client');
    }

    this.environmentValue = config.environment ?? 'sandbox';
    this.http = new CloverHttp({
      apiToken: config.apiToken,
      merchantId: config.merchantId,
      environment: this.environmentValue,
      fetchImpl: config.fetchImpl,
    });

    this.payments = new PaymentsService(this.http);
    this.refunds = new RefundsService(this.http);
    this.customers = new CustomersService(this.http);
  }

  /**
   * The environment this client operates in.
   */
  get environment(): CloverEnvironment {
    return this.environmentValue;
  }

  /**
   * The configured merchant id, if any.
   */
  get merchantId(): string | undefined {
    return this.http.merchantId;
  }
}

/**
 * Create a new Clover client instance.
 *
 * @param config - Client configuration
 * @returns Configured Clover client
 */
export function createCloverClient(config: CloverClientConfig): CloverClient {
  return new CloverClient(config);
}
