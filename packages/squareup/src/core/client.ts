import { SquareClient as SdkClient, SquareEnvironment as SdkEnvironment } from 'square';
import type { SquareEnvironment } from './types/index.js';
import { CURRENCY_CODES, isCurrencyCode } from './types/index.js';
import { SquareValidationError } from './errors.js';
import { PaymentsService } from './services/payments.service.js';
import { OrdersService } from './services/orders.service.js';
import { CustomersService } from './services/customers.service.js';
import { CustomerGroupsService } from './services/customer-groups.service.js';
import { CatalogService } from './services/catalog.service.js';
import { InventoryService } from './services/inventory.service.js';
import { SubscriptionsService } from './services/subscriptions.service.js';
import { InvoicesService } from './services/invoices.service.js';
import { LoyaltyService } from './services/loyalty.service.js';
import { CheckoutService } from './services/checkout.service.js';
import { GiftCardsService } from './services/gift-cards.service.js';
import { LocationsService } from './services/locations.service.js';
import { WebhookSubscriptionsService } from './services/webhook-subscriptions.service.js';

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
  public readonly customers: CustomersService;
  public readonly customerGroups: CustomerGroupsService;
  public readonly catalog: CatalogService;
  public readonly inventory: InventoryService;
  public readonly subscriptions: SubscriptionsService;
  public readonly invoices: InvoicesService;
  public readonly loyalty: LoyaltyService;
  public readonly checkout: CheckoutService;
  public readonly giftCards: GiftCardsService;
  public readonly locations: LocationsService;
  /** Webhook subscription management (`webhooks.subscriptions.*`) */
  public readonly webhooks: { subscriptions: WebhookSubscriptionsService };

  constructor(config: SquareClientConfig) {
    const defaultCurrency = config.defaultCurrency ?? 'USD';
    if (!isCurrencyCode(defaultCurrency)) {
      throw new SquareValidationError(
        `Unsupported defaultCurrency '${defaultCurrency}'. Supported: ${CURRENCY_CODES.join(', ')}.`,
        'defaultCurrency'
      );
    }

    this.config = {
      accessToken: config.accessToken,
      environment: config.environment ?? 'sandbox',
      locationId: config.locationId,
      defaultCurrency,
    };

    this.client = new SdkClient({
      token: this.config.accessToken,
      environment:
        this.config.environment === 'production'
          ? SdkEnvironment.Production
          : SdkEnvironment.Sandbox,
    });

    // `defaultCurrency` (validated above) drives every money-carrying service's
    // fallback so a non-USD merchant doesn't have to pass `currency` on every call.
    const { locationId } = this.config;

    // Initialize services
    this.payments = new PaymentsService(this.client, locationId, defaultCurrency);
    this.orders = new OrdersService(this.client, locationId, defaultCurrency);
    this.customers = new CustomersService(this.client);
    this.customerGroups = new CustomerGroupsService(this.client);
    this.catalog = new CatalogService(this.client, defaultCurrency);
    this.inventory = new InventoryService(this.client, locationId);
    this.subscriptions = new SubscriptionsService(this.client, locationId, defaultCurrency);
    this.invoices = new InvoicesService(this.client, locationId, defaultCurrency);
    this.loyalty = new LoyaltyService(this.client, locationId);
    this.checkout = new CheckoutService(this.client);
    this.giftCards = new GiftCardsService(this.client, locationId, defaultCurrency);
    this.locations = new LocationsService(this.client);
    this.webhooks = { subscriptions: new WebhookSubscriptionsService(this.client) };
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
