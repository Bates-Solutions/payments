import { SquareClient as SdkClient, SquareEnvironment as SdkEnvironment } from 'square';
import type { SquareEnvironment } from './types/index.js';
import { PaymentsService } from './services/payments.service.js';
import { OrdersService } from './services/orders.service.js';

/**
 * Configuration options for the Square client
 */
export interface SquareClientConfig {
  /**
   * Square API access token
   */
  accessToken: string;

  /**
   * Square environment (sandbox or production)
   * @default 'sandbox'
   */
  environment?: SquareEnvironment;

  /**
   * Default location ID for operations that require it
   */
  locationId?: string;

  /**
   * Default currency code
   * @default 'USD'
   */
  defaultCurrency?: string;
}

/**
 * Main Square client wrapper
 *
 * @example
 * ```typescript
 * const square = createSquareClient({
 *   accessToken: process.env.SQUARE_ACCESS_TOKEN!,
 *   environment: 'sandbox',
 *   locationId: 'LXXX',
 * });
 *
 * // Create a payment
 * const payment = await square.payments.create({
 *   sourceId: 'cnon:card-nonce-ok',
 *   amount: 1000, // $10.00
 * });
 * ```
 */
export class SquareClient {
  private readonly client: SdkClient;
  private readonly config: Required<Omit<SquareClientConfig, 'locationId'>> & {
    locationId?: string;
  };

  public readonly payments: PaymentsService;
  public readonly orders: OrdersService;

  constructor(config: SquareClientConfig) {
    this.config = {
      accessToken: config.accessToken,
      environment: config.environment ?? 'sandbox',
      locationId: config.locationId,
      defaultCurrency: config.defaultCurrency ?? 'USD',
    };

    this.client = new SdkClient({
      token: this.config.accessToken,
      environment:
        this.config.environment === 'production'
          ? SdkEnvironment.Production
          : SdkEnvironment.Sandbox,
    });

    // Initialize services
    this.payments = new PaymentsService(this.client, this.config.locationId);
    this.orders = new OrdersService(this.client, this.config.locationId);
  }

  /**
   * Get the underlying Square SDK client
   * Use this for advanced operations not covered by the wrapper
   */
  get sdk(): SdkClient {
    return this.client;
  }

  /**
   * Get the current location ID
   */
  get locationId(): string | undefined {
    return this.config.locationId;
  }

  /**
   * Get the current environment
   */
  get environment(): SquareEnvironment {
    return this.config.environment;
  }
}

/**
 * Create a new Square client instance
 *
 * @param config - Client configuration
 * @returns Configured Square client
 *
 * @example
 * ```typescript
 * const square = createSquareClient({
 *   accessToken: process.env.SQUARE_ACCESS_TOKEN!,
 *   environment: 'sandbox',
 * });
 * ```
 */
export function createSquareClient(config: SquareClientConfig): SquareClient {
  return new SquareClient(config);
}
