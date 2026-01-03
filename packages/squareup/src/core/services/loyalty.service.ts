import type { SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * Loyalty account from Square API
 */
export interface LoyaltyAccount {
  id?: string;
  programId?: string;
  balance?: number;
  lifetimePoints?: number;
  customerId?: string;
  enrolledAt?: string;
  createdAt?: string;
  updatedAt?: string;
  mapping?: {
    id?: string;
    phoneNumber?: string;
  };
  expiringPointDeadlines?: Array<{
    points?: number;
    expiresAt?: string;
  }>;
}

/**
 * Loyalty program from Square API
 */
export interface LoyaltyProgram {
  id?: string;
  status?: 'INACTIVE' | 'ACTIVE';
  rewardTiers?: Array<{
    id?: string;
    points?: number;
    name?: string;
    definition?: {
      scope?: string;
      discountType?: string;
      percentageDiscount?: string;
      catalogObjectIds?: string[];
    };
    createdAt?: string;
    pricingRuleReference?: {
      objectId?: string;
      catalogVersion?: bigint;
    };
  }>;
  terminology?: {
    one?: string;
    other?: string;
  };
  locationIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  accrualRules?: Array<{
    accrualType?: string;
    points?: number;
    visitData?: {
      minimumAmountMoney?: {
        amount?: bigint;
        currency?: string;
      };
      taxMode?: string;
    };
    spendData?: {
      amountMoney?: {
        amount?: bigint;
        currency?: string;
      };
      excludedCategoryIds?: string[];
      excludedItemVariationIds?: string[];
      taxMode?: string;
    };
  }>;
  expirationPolicy?: {
    expirationDuration?: string;
  };
}

/**
 * Loyalty event from Square API
 */
export interface LoyaltyEvent {
  id?: string;
  type?: string;
  createdAt?: string;
  loyaltyAccountId?: string;
  source?: string;
  accumulatePoints?: {
    loyaltyProgramId?: string;
    points?: number;
    orderId?: string;
  };
  redeemReward?: {
    loyaltyProgramId?: string;
    rewardId?: string;
    orderId?: string;
  };
  adjustPoints?: {
    loyaltyProgramId?: string;
    points?: number;
    reason?: string;
  };
}

/**
 * Options for creating a loyalty account
 */
export interface CreateLoyaltyAccountOptions {
  programId: string;
  phoneNumber?: string;
  customerId?: string;
  idempotencyKey?: string;
}

/**
 * Loyalty service for managing Square loyalty programs
 *
 * @example
 * ```typescript
 * // Create a loyalty account
 * const account = await square.loyalty.createAccount({
 *   programId: 'PROG_123',
 *   phoneNumber: '+15551234567',
 * });
 *
 * // Add points
 * await square.loyalty.accumulatePoints(account.id, {
 *   points: 100,
 * });
 *
 * // Redeem a reward
 * await square.loyalty.redeemReward(account.id, 'REWARD_123');
 * ```
 */
export class LoyaltyService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string
  ) {}

  /**
   * Get the loyalty program for the current location
   *
   * @param programId - Optional program ID (uses main program if not provided)
   * @returns Loyalty program details
   *
   * @example
   * ```typescript
   * const program = await square.loyalty.getProgram();
   * console.log(`Points name: ${program.terminology?.other}`);
   * ```
   */
  async getProgram(programId?: string): Promise<LoyaltyProgram> {
    try {
      if (programId) {
        const response = await this.client.loyalty.programs.get({ programId });
        if (!response.program) {
          throw new Error('Loyalty program not found');
        }
        return response.program as LoyaltyProgram;
      }

      // Get the main program
      const response = await this.client.loyalty.programs.list();
      const programs = response.programs ?? [];

      if (programs.length === 0) {
        throw new Error('No loyalty program found');
      }

      return programs[0] as LoyaltyProgram;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Create a new loyalty account
   *
   * @param options - Account creation options
   * @returns Created loyalty account
   *
   * @example
   * ```typescript
   * const account = await square.loyalty.createAccount({
   *   programId: 'PROG_123',
   *   phoneNumber: '+15551234567',
   * });
   * ```
   */
  async createAccount(options: CreateLoyaltyAccountOptions): Promise<LoyaltyAccount> {
    if (!options.programId) {
      throw new SquareValidationError('programId is required', 'programId');
    }

    if (!options.phoneNumber && !options.customerId) {
      throw new SquareValidationError(
        'Either phoneNumber or customerId is required',
        'phoneNumber'
      );
    }

    try {
      const response = await this.client.loyalty.accounts.create({
        loyaltyAccount: {
          programId: options.programId,
          mapping: options.phoneNumber
            ? {
                phoneNumber: options.phoneNumber,
              }
            : undefined,
          customerId: options.customerId,
        },
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
      });

      if (!response.loyaltyAccount) {
        throw new Error('Loyalty account was not created');
      }

      return response.loyaltyAccount as LoyaltyAccount;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a loyalty account by ID
   *
   * @param accountId - Loyalty account ID
   * @returns Loyalty account details
   *
   * @example
   * ```typescript
   * const account = await square.loyalty.getAccount('ACCT_123');
   * console.log(`Balance: ${account.balance} points`);
   * ```
   */
  async getAccount(accountId: string): Promise<LoyaltyAccount> {
    try {
      const response = await this.client.loyalty.accounts.get({ accountId });

      if (!response.loyaltyAccount) {
        throw new Error('Loyalty account not found');
      }

      return response.loyaltyAccount as LoyaltyAccount;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Search for loyalty accounts
   *
   * @param options - Search options
   * @returns Matching loyalty accounts
   *
   * @example
   * ```typescript
   * // Find by phone number
   * const accounts = await square.loyalty.searchAccounts({
   *   phoneNumber: '+15551234567',
   * });
   *
   * // Find by customer ID
   * const accounts = await square.loyalty.searchAccounts({
   *   customerId: 'CUST_123',
   * });
   * ```
   */
  async searchAccounts(options?: {
    phoneNumber?: string;
    customerId?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ data: LoyaltyAccount[]; cursor?: string }> {
    try {
      const mappings: Array<{ phoneNumber?: string }> = [];
      const customerIds: string[] = [];

      if (options?.phoneNumber) {
        mappings.push({ phoneNumber: options.phoneNumber });
      }

      if (options?.customerId) {
        customerIds.push(options.customerId);
      }

      const response = await this.client.loyalty.accounts.search({
        cursor: options?.cursor,
        limit: options?.limit,
        query:
          mappings.length > 0 || customerIds.length > 0
            ? {
                mappings: mappings.length > 0 ? mappings : undefined,
                customerIds: customerIds.length > 0 ? customerIds : undefined,
              }
            : undefined,
      });

      return {
        data: (response.loyaltyAccounts ?? []) as LoyaltyAccount[],
        cursor: response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Accumulate (add) points to a loyalty account
   *
   * @param accountId - Loyalty account ID
   * @param options - Accumulation options
   * @returns Loyalty event
   *
   * @example
   * ```typescript
   * // Add points from an order
   * await square.loyalty.accumulatePoints('ACCT_123', {
   *   orderId: 'ORDER_456',
   * });
   *
   * // Add points manually
   * await square.loyalty.accumulatePoints('ACCT_123', {
   *   points: 50,
   * });
   * ```
   */
  async accumulatePoints(
    accountId: string,
    options: {
      orderId?: string;
      points?: number;
      idempotencyKey?: string;
    }
  ): Promise<LoyaltyEvent> {
    const locationId = this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config.',
        'locationId'
      );
    }

    if (!options.orderId && !options.points) {
      throw new SquareValidationError('Either orderId or points is required');
    }

    try {
      const response = await this.client.loyalty.accounts.accumulatePoints({
        accountId,
        accumulatePoints: {
          orderId: options.orderId,
          points: options.points,
        },
        locationId,
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
      });

      if (!response.event) {
        throw new Error('Points accumulation failed');
      }

      return response.event as LoyaltyEvent;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Adjust points on a loyalty account (add or subtract)
   *
   * @param accountId - Loyalty account ID
   * @param points - Points to add (positive) or subtract (negative)
   * @param reason - Reason for adjustment
   * @returns Loyalty event
   *
   * @example
   * ```typescript
   * // Add bonus points
   * await square.loyalty.adjustPoints('ACCT_123', 100, 'Birthday bonus');
   *
   * // Remove points
   * await square.loyalty.adjustPoints('ACCT_123', -50, 'Points correction');
   * ```
   */
  async adjustPoints(
    accountId: string,
    points: number,
    reason?: string,
    idempotencyKey?: string
  ): Promise<LoyaltyEvent> {
    try {
      const response = await this.client.loyalty.accounts.adjust({
        accountId,
        adjustPoints: {
          points,
          reason,
        },
        idempotencyKey: idempotencyKey ?? createIdempotencyKey(),
      });

      if (!response.event) {
        throw new Error('Points adjustment failed');
      }

      return response.event as LoyaltyEvent;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Redeem a reward
   *
   * @param accountId - Loyalty account ID
   * @param rewardTierId - Reward tier ID to redeem
   * @param orderId - Optional order ID to apply reward to
   * @returns Created reward
   *
   * @example
   * ```typescript
   * const reward = await square.loyalty.redeemReward(
   *   'ACCT_123',
   *   'TIER_123',
   *   'ORDER_456'
   * );
   * ```
   */
  async redeemReward(
    accountId: string,
    rewardTierId: string,
    orderId?: string,
    idempotencyKey?: string
  ): Promise<{ id: string; status: string }> {
    const locationId = this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config.',
        'locationId'
      );
    }

    try {
      const response = await this.client.loyalty.rewards.create({
        reward: {
          loyaltyAccountId: accountId,
          rewardTierId,
          orderId,
        },
        idempotencyKey: idempotencyKey ?? createIdempotencyKey(),
      });

      if (!response.reward?.id) {
        throw new Error('Reward creation failed');
      }

      const rewardId = response.reward.id;

      // Redeem the reward
      const redeemResponse = await this.client.loyalty.rewards.redeem({
        rewardId,
        locationId,
        idempotencyKey: createIdempotencyKey(),
      });

      if (!redeemResponse.event) {
        throw new Error('Reward redemption failed');
      }

      return {
        id: rewardId,
        status: 'REDEEMED',
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Calculate points that would be earned for an order
   *
   * @param programId - Loyalty program ID
   * @param orderId - Order ID to calculate points for
   * @returns Points that would be earned
   *
   * @example
   * ```typescript
   * const points = await square.loyalty.calculatePoints('PROG_123', 'ORDER_123');
   * console.log(`This order earns ${points} points`);
   * ```
   */
  async calculatePoints(programId: string, orderId: string): Promise<number> {
    try {
      const response = await this.client.loyalty.programs.calculate({
        programId,
        orderId,
      });

      return response.points ?? 0;
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
