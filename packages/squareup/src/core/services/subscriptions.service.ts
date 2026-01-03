import type { SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * Subscription status types
 */
export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'CANCELED' | 'DEACTIVATED' | 'PAUSED';

/**
 * Subscription cadence types
 */
export type SubscriptionCadence =
  | 'DAILY'
  | 'WEEKLY'
  | 'EVERY_TWO_WEEKS'
  | 'THIRTY_DAYS'
  | 'SIXTY_DAYS'
  | 'NINETY_DAYS'
  | 'MONTHLY'
  | 'EVERY_TWO_MONTHS'
  | 'QUARTERLY'
  | 'EVERY_FOUR_MONTHS'
  | 'EVERY_SIX_MONTHS'
  | 'ANNUAL'
  | 'EVERY_TWO_YEARS';

/**
 * Subscription from Square API
 */
export interface Subscription {
  id?: string;
  locationId?: string;
  planVariationId?: string;
  customerId?: string;
  startDate?: string;
  canceledDate?: string;
  chargedThroughDate?: string;
  status?: SubscriptionStatus;
  taxPercentage?: string;
  invoiceIds?: string[];
  priceOverrideMoney?: {
    amount?: bigint;
    currency?: string;
  };
  version?: bigint;
  createdAt?: string;
  cardId?: string;
  timezone?: string;
  source?: {
    name?: string;
  };
}

/**
 * Subscription plan from Square API
 */
export interface SubscriptionPlan {
  id?: string;
  type?: string;
  subscriptionPlanData?: {
    name?: string;
    subscriptionPlanVariations?: Array<{
      id?: string;
      subscriptionPlanVariationData?: {
        name?: string;
        phases?: Array<{
          cadence?: SubscriptionCadence;
          recurringPriceMoney?: {
            amount?: bigint;
            currency?: string;
          };
        }>;
      };
    }>;
  };
}

/**
 * Options for creating a subscription
 */
export interface CreateSubscriptionOptions {
  customerId: string;
  planVariationId: string;
  locationId?: string;
  startDate?: string;
  cardId?: string;
  timezone?: string;
  priceOverride?: number;
  taxPercentage?: string;
  idempotencyKey?: string;
}

/**
 * Subscriptions service for managing Square subscriptions
 *
 * @example
 * ```typescript
 * // Create a subscription
 * const subscription = await square.subscriptions.create({
 *   customerId: 'CUST_123',
 *   planVariationId: 'PLAN_VAR_123',
 * });
 *
 * // Cancel a subscription
 * await square.subscriptions.cancel('SUB_123');
 * ```
 */
export class SubscriptionsService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string
  ) {}

  /**
   * Create a new subscription
   *
   * @param options - Subscription creation options
   * @returns Created subscription
   *
   * @example
   * ```typescript
   * const subscription = await square.subscriptions.create({
   *   customerId: 'CUST_123',
   *   planVariationId: 'PLAN_VAR_123',
   *   startDate: '2024-02-01',
   * });
   * ```
   */
  async create(options: CreateSubscriptionOptions): Promise<Subscription> {
    const locationId = options.locationId ?? this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    if (!options.customerId) {
      throw new SquareValidationError('customerId is required', 'customerId');
    }

    if (!options.planVariationId) {
      throw new SquareValidationError('planVariationId is required', 'planVariationId');
    }

    try {
      const response = await this.client.subscriptions.create({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        locationId,
        customerId: options.customerId,
        planVariationId: options.planVariationId,
        startDate: options.startDate,
        cardId: options.cardId,
        timezone: options.timezone,
        priceOverrideMoney: options.priceOverride
          ? {
              amount: BigInt(options.priceOverride),
              currency: 'USD',
            }
          : undefined,
        taxPercentage: options.taxPercentage,
      });

      if (!response.subscription) {
        throw new Error('Subscription was not created');
      }

      return response.subscription as Subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a subscription by ID
   *
   * @param subscriptionId - Subscription ID
   * @returns Subscription details
   *
   * @example
   * ```typescript
   * const subscription = await square.subscriptions.get('SUB_123');
   * ```
   */
  async get(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.client.subscriptions.get({ subscriptionId });

      if (!response.subscription) {
        throw new Error('Subscription not found');
      }

      return response.subscription as Subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Update a subscription
   *
   * @param subscriptionId - Subscription ID
   * @param options - Update options
   * @returns Updated subscription
   *
   * @example
   * ```typescript
   * const subscription = await square.subscriptions.update('SUB_123', {
   *   priceOverride: 1500,
   * });
   * ```
   */
  async update(
    subscriptionId: string,
    options: {
      priceOverride?: number;
      cardId?: string;
      taxPercentage?: string;
    }
  ): Promise<Subscription> {
    try {
      const response = await this.client.subscriptions.update({
        subscriptionId,
        subscription: {
          priceOverrideMoney: options.priceOverride
            ? {
                amount: BigInt(options.priceOverride),
                currency: 'USD',
              }
            : undefined,
          cardId: options.cardId,
          taxPercentage: options.taxPercentage,
        },
      });

      if (!response.subscription) {
        throw new Error('Subscription update failed');
      }

      return response.subscription as Subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Cancel a subscription
   *
   * @param subscriptionId - Subscription ID to cancel
   * @returns Cancelled subscription
   *
   * @example
   * ```typescript
   * const subscription = await square.subscriptions.cancel('SUB_123');
   * ```
   */
  async cancel(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.client.subscriptions.cancel({ subscriptionId });

      if (!response.subscription) {
        throw new Error('Subscription cancellation failed');
      }

      return response.subscription as Subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Pause a subscription
   *
   * @param subscriptionId - Subscription ID to pause
   * @param options - Pause options
   * @returns Paused subscription
   *
   * @example
   * ```typescript
   * const subscription = await square.subscriptions.pause('SUB_123', {
   *   pauseEffectiveDate: '2024-03-01',
   * });
   * ```
   */
  async pause(
    subscriptionId: string,
    options?: {
      pauseEffectiveDate?: string;
      pauseCycleDuration?: number;
    }
  ): Promise<Subscription> {
    try {
      const response = await this.client.subscriptions.pause({
        subscriptionId,
        pauseEffectiveDate: options?.pauseEffectiveDate,
        pauseCycleDuration: options?.pauseCycleDuration
          ? BigInt(options.pauseCycleDuration)
          : undefined,
      });

      if (!response.subscription) {
        throw new Error('Subscription pause failed');
      }

      return response.subscription as Subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Resume a paused subscription
   *
   * @param subscriptionId - Subscription ID to resume
   * @param resumeEffectiveDate - Optional date to resume
   * @returns Resumed subscription
   *
   * @example
   * ```typescript
   * const subscription = await square.subscriptions.resume('SUB_123');
   * ```
   */
  async resume(subscriptionId: string, resumeEffectiveDate?: string): Promise<Subscription> {
    try {
      const response = await this.client.subscriptions.resume({
        subscriptionId,
        resumeEffectiveDate,
      });

      if (!response.subscription) {
        throw new Error('Subscription resume failed');
      }

      return response.subscription as Subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Search for subscriptions
   *
   * @param options - Search options
   * @returns Matching subscriptions with pagination
   *
   * @example
   * ```typescript
   * const results = await square.subscriptions.search({
   *   customerId: 'CUST_123',
   * });
   * ```
   */
  async search(options?: {
    customerId?: string;
    locationIds?: string[];
    cursor?: string;
    limit?: number;
  }): Promise<{ data: Subscription[]; cursor?: string }> {
    try {
      const filters: Record<string, unknown>[] = [];

      if (options?.customerId) {
        filters.push({
          customerIds: [options.customerId],
        });
      }

      if (options?.locationIds) {
        filters.push({
          locationIds: options.locationIds,
        });
      }

      const response = await this.client.subscriptions.search({
        cursor: options?.cursor,
        limit: options?.limit,
        query:
          filters.length > 0
            ? {
                filter: filters.reduce((acc, f) => ({ ...acc, ...f }), {}),
              }
            : undefined,
      });

      return {
        data: (response.subscriptions ?? []) as Subscription[],
        cursor: response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
