import type { SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';
import type { CurrencyCode } from '../types/index.js';

/**
 * Gift card form factor.
 */
export type GiftCardType = 'PHYSICAL' | 'DIGITAL';

/**
 * Source that produced the gift card account number (GAN).
 *
 * - `SQUARE` (default) — Square generated the GAN
 * - `OTHER` — caller supplied a custom GAN
 */
export type GiftCardGanSource = 'SQUARE' | 'OTHER';

/**
 * Lifecycle state of a gift card.
 *
 * New cards start in `PENDING` and require an `ACTIVATE` activity before they
 * can be redeemed.
 */
export type GiftCardState =
  | 'PENDING'
  | 'ACTIVE'
  | 'DEACTIVATED'
  | 'BLOCKED'
  | 'UNLINKED_OWNER';

/**
 * Square gift card.
 */
export interface GiftCard {
  id?: string;
  type?: GiftCardType;
  ganSource?: GiftCardGanSource;
  state?: GiftCardState;
  balanceMoney?: {
    amount?: bigint;
    currency?: string;
  };
  gan?: string;
  customerIds?: string[];
  createdAt?: string;
}

/**
 * All gift card activity types supported by Square.
 */
export type GiftCardActivityType =
  | 'ACTIVATE'
  | 'LOAD'
  | 'REDEEM'
  | 'CLEAR_BALANCE'
  | 'DEACTIVATE'
  | 'ADJUST_INCREMENT'
  | 'ADJUST_DECREMENT'
  | 'REFUND'
  | 'UNLINKED_ACTIVITY_REFUND'
  | 'IMPORT'
  | 'BLOCK'
  | 'UNBLOCK'
  | 'IMPORT_REVERSAL'
  | 'TRANSFER_BALANCE_FROM'
  | 'TRANSFER_BALANCE_TO';

/**
 * Reason a gift card was deactivated.
 */
export type GiftCardDeactivateReason =
  | 'SUSPICIOUS_ACTIVITY'
  | 'UNKNOWN_REASON'
  | 'CHARGEBACK_DEACTIVATE';

/**
 * Reason an `ADJUST_INCREMENT` activity was applied (money added outside a
 * normal ACTIVATE/LOAD/REFUND flow).
 */
export type AdjustIncrementReason =
  | 'COMPLIMENTARY'
  | 'SUPPORT_ISSUE'
  | 'TRANSACTION_VOIDED';

/**
 * Reason an `ADJUST_DECREMENT` activity was applied (money removed outside a
 * normal REDEEM flow).
 */
export type AdjustDecrementReason = 'SUSPICIOUS_ACTIVITY' | 'BALANCE_REMAINING';

/**
 * Gift card activity returned by the Activities API.
 *
 * The `*ActivityDetails` fields are populated based on `type`.
 */
export interface GiftCardActivity {
  id?: string;
  type?: GiftCardActivityType;
  locationId?: string;
  createdAt?: string;
  giftCardId?: string;
  giftCardGan?: string;
  giftCardBalanceMoney?: {
    amount?: bigint;
    currency?: string;
  };
  activateActivityDetails?: ActivateActivityDetails;
  loadActivityDetails?: LoadActivityDetails;
  redeemActivityDetails?: RedeemActivityDetails;
  clearBalanceActivityDetails?: { reason?: string };
  deactivateActivityDetails?: { reason?: GiftCardDeactivateReason };
  adjustIncrementActivityDetails?: AdjustIncrementActivityDetails;
  adjustDecrementActivityDetails?: AdjustDecrementActivityDetails;
}

export interface ActivateActivityDetails {
  amountMoney?: { amount?: bigint; currency?: string };
  orderId?: string;
  lineItemUid?: string;
  referenceId?: string;
  buyerPaymentInstrumentIds?: string[];
}

export interface LoadActivityDetails {
  amountMoney?: { amount?: bigint; currency?: string };
  orderId?: string;
  lineItemUid?: string;
  referenceId?: string;
  buyerPaymentInstrumentIds?: string[];
}

export interface RedeemActivityDetails {
  amountMoney: { amount?: bigint; currency?: string };
  paymentId?: string;
  referenceId?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELED';
}

export interface AdjustIncrementActivityDetails {
  amountMoney: { amount: bigint | number; currency: string };
  reason: AdjustIncrementReason;
}

export interface AdjustDecrementActivityDetails {
  amountMoney: { amount: bigint | number; currency: string };
  reason: AdjustDecrementReason;
}

/**
 * Options for creating a gift card.
 *
 * GAN handling:
 * - Omit `gan` and `ganSource` to let Square generate a 16-digit GAN.
 * - Set `ganSource: 'OTHER'` and provide a custom `gan` (8–20 alphanumeric
 *   characters) for application-supplied GANs.
 * - For unactivated physical cards previously ordered from Square, provide
 *   only `gan` (the printed value); leave `ganSource` unset.
 */
export interface CreateGiftCardOptions {
  type: GiftCardType;
  /**
   * Location to register the card under. Defaults to the client's configured
   * location ID.
   */
  locationId?: string;
  gan?: string;
  ganSource?: GiftCardGanSource;
  idempotencyKey?: string;
}

/**
 * Options for listing gift cards.
 */
export interface ListGiftCardsOptions {
  type?: GiftCardType;
  state?: GiftCardState;
  customerId?: string;
  limit?: number;
  cursor?: string;
}

/**
 * Options for creating a gift card activity.
 *
 * Specify exactly one of `giftCardId` or `giftCardGan` to identify the card.
 * Provide the corresponding `*ActivityDetails` field for the chosen `type`
 * (e.g. `activateActivityDetails` for `'ACTIVATE'`).
 */
export interface CreateGiftCardActivityOptions {
  type: GiftCardActivityType;
  /**
   * Location where the activity occurred. Defaults to the client's configured
   * location ID.
   */
  locationId?: string;
  giftCardId?: string;
  giftCardGan?: string;
  activateActivityDetails?: ActivateActivityDetails;
  loadActivityDetails?: LoadActivityDetails;
  redeemActivityDetails?: RedeemActivityDetails;
  clearBalanceActivityDetails?: { reason?: string };
  deactivateActivityDetails?: { reason?: GiftCardDeactivateReason };
  adjustIncrementActivityDetails?: AdjustIncrementActivityDetails;
  adjustDecrementActivityDetails?: AdjustDecrementActivityDetails;
  idempotencyKey?: string;
}

/**
 * Options for listing gift card activities.
 */
export interface ListGiftCardActivitiesOptions {
  giftCardId?: string;
  type?: GiftCardActivityType;
  locationId?: string;
  beginTime?: string;
  endTime?: string;
  limit?: number;
  cursor?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Coerce optional money input into the bigint shape Square expects.
 */
function toMoney(
  money?: { amount?: bigint | number; currency?: string }
): { amount?: bigint; currency?: string } | undefined {
  if (!money) return undefined;
  return {
    amount: money.amount !== undefined ? BigInt(money.amount) : undefined,
    currency: money.currency,
  };
}

/**
 * Service for managing gift card activities (the Gift Card Activities API).
 *
 * Activities mutate a card's balance and lifecycle state — `ACTIVATE` puts an
 * initial balance on a `PENDING` card, `LOAD` tops it up, `REDEEM` deducts at
 * checkout, `DEACTIVATE` retires the card.
 *
 * Accessed via `square.giftCards.activities`.
 *
 * @example
 * ```typescript
 * await square.giftCards.activities.create({
 *   type: 'LOAD',
 *   giftCardId: 'gftc:abc',
 *   loadActivityDetails: {
 *     amountMoney: { amount: 1000, currency: 'USD' },
 *   },
 * });
 * ```
 */
export class GiftCardActivitiesService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string
  ) {}

  /**
   * Create a gift card activity.
   *
   * Idempotency keys are required by Square — auto-generated when omitted.
   * Always pass a stable key for retries to avoid double-applying activities
   * (a duplicate REDEEM would double-deduct the card).
   */
  async create(options: CreateGiftCardActivityOptions): Promise<GiftCardActivity> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options.type) {
      throw new SquareValidationError('Activity type is required', 'type');
    }
    if (!options.giftCardId && !options.giftCardGan) {
      throw new SquareValidationError(
        'One of giftCardId or giftCardGan is required',
        'giftCardId'
      );
    }

    const locationId = options.locationId ?? this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    const activityPayload = {
      type: options.type,
      locationId,
      giftCardId: options.giftCardId,
      giftCardGan: options.giftCardGan,
      activateActivityDetails: options.activateActivityDetails
        ? {
            ...options.activateActivityDetails,
            amountMoney: toMoney(options.activateActivityDetails.amountMoney),
          }
        : undefined,
      loadActivityDetails: options.loadActivityDetails
        ? {
            ...options.loadActivityDetails,
            amountMoney: toMoney(options.loadActivityDetails.amountMoney),
          }
        : undefined,
      redeemActivityDetails: options.redeemActivityDetails
        ? {
            ...options.redeemActivityDetails,
            amountMoney: toMoney(options.redeemActivityDetails.amountMoney),
          }
        : undefined,
      clearBalanceActivityDetails: options.clearBalanceActivityDetails,
      deactivateActivityDetails: options.deactivateActivityDetails,
      adjustIncrementActivityDetails: options.adjustIncrementActivityDetails
        ? {
            amountMoney: toMoney(options.adjustIncrementActivityDetails.amountMoney),
            reason: options.adjustIncrementActivityDetails.reason,
          }
        : undefined,
      adjustDecrementActivityDetails: options.adjustDecrementActivityDetails
        ? {
            amountMoney: toMoney(options.adjustDecrementActivityDetails.amountMoney),
            reason: options.adjustDecrementActivityDetails.reason,
          }
        : undefined,
    };

    try {
      const response = await this.client.giftCards.activities.create({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        giftCardActivity: activityPayload as any,
      });

      if (!response.giftCardActivity) {
        throw new Error('Gift card activity was not created');
      }

      return response.giftCardActivity as GiftCardActivity;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List gift card activities, optionally filtered by card, type, location,
   * or time range.
   */
  async list(
    options?: ListGiftCardActivitiesOptions
  ): Promise<{ activities: GiftCardActivity[]; cursor?: string }> {
    try {
      const page = await this.client.giftCards.activities.list({
        giftCardId: options?.giftCardId,
        type: options?.type,
        locationId: options?.locationId,
        beginTime: options?.beginTime,
        endTime: options?.endTime,
        limit: options?.limit,
        cursor: options?.cursor,
        sortOrder: options?.sortOrder,
      });

      return {
        activities: (page.response.giftCardActivities ?? []) as GiftCardActivity[],
        cursor: page.response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}

/**
 * Service for managing Square gift cards — issuance, lookup, customer linking.
 *
 * Activities (activate, load, redeem, deactivate, etc.) are accessed via
 * `square.giftCards.activities`. Convenience helpers (`activate`, `load`,
 * `redeem`, `deactivate`) are also exposed directly on this service for the
 * common cases.
 *
 * @example
 * ```typescript
 * // Issue a digital card and activate it with $25
 * const card = await square.giftCards.create({ type: 'DIGITAL' });
 * await square.giftCards.activate(card.id!, 2500);
 * ```
 */
export class GiftCardsService {
  public readonly activities: GiftCardActivitiesService;

  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string
  ) {
    this.activities = new GiftCardActivitiesService(client, defaultLocationId);
  }

  /**
   * Create (issue) a new gift card.
   *
   * New cards are created in `PENDING` state. Call `activate()` (or
   * `activities.create({ type: 'ACTIVATE' })`) to set an initial balance
   * before redemption.
   */
  async create(options: CreateGiftCardOptions): Promise<GiftCard> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options.type) {
      throw new SquareValidationError('Gift card type is required', 'type');
    }

    const locationId = options.locationId ?? this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    try {
      const response = await this.client.giftCards.create({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        locationId,
        giftCard: {
          type: options.type,
          gan: options.gan,
          ganSource: options.ganSource,
        },
      });

      if (!response.giftCard) {
        throw new Error('Gift card was not created');
      }

      return response.giftCard as GiftCard;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a gift card by ID.
   */
  async get(giftCardId: string): Promise<GiftCard> {
    try {
      const response = await this.client.giftCards.get({ id: giftCardId });

      if (!response.giftCard) {
        throw new Error('Gift card not found');
      }

      return response.giftCard as GiftCard;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a gift card by GAN (gift card account number).
   */
  async getFromGan(gan: string): Promise<GiftCard> {
    try {
      const response = await this.client.giftCards.getFromGan({ gan });

      if (!response.giftCard) {
        throw new Error('Gift card not found');
      }

      return response.giftCard as GiftCard;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a gift card from a payment-source nonce (e.g. produced by the
   * Square Web Payments SDK at checkout).
   */
  async getFromNonce(nonce: string): Promise<GiftCard> {
    try {
      const response = await this.client.giftCards.getFromNonce({ nonce });

      if (!response.giftCard) {
        throw new Error('Gift card not found');
      }

      return response.giftCard as GiftCard;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List gift cards, optionally filtered by type, state, or linked customer.
   */
  async list(
    options?: ListGiftCardsOptions
  ): Promise<{ giftCards: GiftCard[]; cursor?: string }> {
    try {
      const page = await this.client.giftCards.list({
        type: options?.type,
        state: options?.state,
        customerId: options?.customerId,
        limit: options?.limit,
        cursor: options?.cursor,
      });

      return {
        giftCards: (page.response.giftCards ?? []) as GiftCard[],
        cursor: page.response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Alias for `list()`. Maintained for parity with the issue's proposed shape.
   */
  async search(
    options?: ListGiftCardsOptions
  ): Promise<{ data: GiftCard[]; cursor?: string }> {
    const { giftCards, cursor } = await this.list(options);
    return { data: giftCards, cursor };
  }

  /**
   * Link a gift card to a customer profile. Returns the updated card with the
   * customer ID added to `customerIds`.
   */
  async linkCustomer(giftCardId: string, customerId: string): Promise<GiftCard> {
    if (!giftCardId) {
      throw new SquareValidationError('giftCardId is required', 'giftCardId');
    }
    if (!customerId) {
      throw new SquareValidationError('customerId is required', 'customerId');
    }

    try {
      const response = await this.client.giftCards.linkCustomer({
        giftCardId,
        customerId,
      });

      if (!response.giftCard) {
        throw new Error('Gift card link failed');
      }

      return response.giftCard as GiftCard;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Unlink a customer from a gift card. Returns the updated card.
   */
  async unlinkCustomer(giftCardId: string, customerId: string): Promise<GiftCard> {
    if (!giftCardId) {
      throw new SquareValidationError('giftCardId is required', 'giftCardId');
    }
    if (!customerId) {
      throw new SquareValidationError('customerId is required', 'customerId');
    }

    try {
      const response = await this.client.giftCards.unlinkCustomer({
        giftCardId,
        customerId,
      });

      if (!response.giftCard) {
        throw new Error('Gift card unlink failed');
      }

      return response.giftCard as GiftCard;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Activate a `PENDING` gift card with an initial balance. Convenience
   * wrapper over `activities.create({ type: 'ACTIVATE' })`.
   */
  async activate(
    giftCardId: string,
    amount: number | bigint,
    options?: {
      currency?: CurrencyCode;
      locationId?: string;
      orderId?: string;
      lineItemUid?: string;
      referenceId?: string;
      idempotencyKey?: string;
    }
  ): Promise<GiftCardActivity> {
    return this.activities.create({
      type: 'ACTIVATE',
      giftCardId,
      locationId: options?.locationId,
      idempotencyKey: options?.idempotencyKey,
      activateActivityDetails: {
        amountMoney: { amount: BigInt(amount), currency: options?.currency ?? 'USD' },
        orderId: options?.orderId,
        lineItemUid: options?.lineItemUid,
        referenceId: options?.referenceId,
      },
    });
  }

  /**
   * Load (top up) an active gift card.
   */
  async load(
    giftCardId: string,
    amount: number | bigint,
    options?: {
      currency?: CurrencyCode;
      locationId?: string;
      orderId?: string;
      lineItemUid?: string;
      referenceId?: string;
      idempotencyKey?: string;
    }
  ): Promise<GiftCardActivity> {
    return this.activities.create({
      type: 'LOAD',
      giftCardId,
      locationId: options?.locationId,
      idempotencyKey: options?.idempotencyKey,
      loadActivityDetails: {
        amountMoney: { amount: BigInt(amount), currency: options?.currency ?? 'USD' },
        orderId: options?.orderId,
        lineItemUid: options?.lineItemUid,
        referenceId: options?.referenceId,
      },
    });
  }

  /**
   * Redeem from a gift card (deduct funds). For payments processed through
   * the Square Payments API, Square creates the REDEEM activity automatically;
   * use this only with a custom payment processor.
   */
  async redeem(
    giftCardId: string,
    amount: number | bigint,
    options?: {
      currency?: CurrencyCode;
      locationId?: string;
      paymentId?: string;
      referenceId?: string;
      idempotencyKey?: string;
    }
  ): Promise<GiftCardActivity> {
    return this.activities.create({
      type: 'REDEEM',
      giftCardId,
      locationId: options?.locationId,
      idempotencyKey: options?.idempotencyKey,
      redeemActivityDetails: {
        amountMoney: { amount: BigInt(amount), currency: options?.currency ?? 'USD' },
        paymentId: options?.paymentId,
        referenceId: options?.referenceId,
      },
    });
  }

  /**
   * Deactivate a gift card permanently.
   */
  async deactivate(
    giftCardId: string,
    reason: GiftCardDeactivateReason = 'UNKNOWN_REASON',
    options?: { locationId?: string; idempotencyKey?: string }
  ): Promise<GiftCardActivity> {
    return this.activities.create({
      type: 'DEACTIVATE',
      giftCardId,
      locationId: options?.locationId,
      idempotencyKey: options?.idempotencyKey,
      deactivateActivityDetails: { reason },
    });
  }
}
