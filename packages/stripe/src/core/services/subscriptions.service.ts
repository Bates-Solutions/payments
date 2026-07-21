import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError } from '../errors.js';
import { fromUnixTime, resolveId } from '../utils.js';

/**
 * The raw Stripe Subscription
 */
export type Subscription = Stripe.Subscription;

/**
 * Subscription status
 */
export type SubscriptionStatus = Stripe.Subscription.Status;

/**
 * A single normalized subscription item.
 */
export interface NormalizedSubscriptionItem {
  id: string;
  priceId?: string;
  quantity?: number;
}

/**
 * A normalized subscription with a stable shape across Stripe API versions.
 *
 * Notably, `currentPeriodStart` / `currentPeriodEnd` are surfaced as JS `Date`s
 * regardless of whether the pinned API version puts `current_period_*` on the
 * subscription (older) or on the subscription item (newer) — the wrapper reads
 * from the item first and falls back to the subscription.
 */
export interface NormalizedSubscription {
  id: string;
  status: SubscriptionStatus;
  customerId?: string;
  /** Price ID of the first item — the common single-item case */
  priceId?: string;
  /** Quantity of the first item */
  quantity?: number;
  items: NormalizedSubscriptionItem[];
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialEnd?: Date;
  /** The raw Stripe subscription, for anything not normalized here */
  raw: Subscription;
}

/**
 * Normalize a raw Stripe subscription into a version-stable shape.
 */
export function normalizeSubscription(subscription: Subscription): NormalizedSubscription {
  const firstItem = subscription.items.data[0];

  // Version churn: `current_period_*` moved from the subscription onto items in
  // newer API versions. Read from the item first, then fall back.
  const legacy = subscription as unknown as {
    current_period_start?: number;
    current_period_end?: number;
  };
  const periodStart = firstItem?.current_period_start ?? legacy.current_period_start;
  const periodEnd = firstItem?.current_period_end ?? legacy.current_period_end;

  return {
    id: subscription.id,
    status: subscription.status,
    customerId: resolveId(subscription.customer),
    priceId: firstItem?.price.id,
    quantity: firstItem?.quantity,
    items: subscription.items.data.map((item) => ({
      id: item.id,
      priceId: item.price.id,
      quantity: item.quantity,
    })),
    currentPeriodStart: fromUnixTime(periodStart),
    currentPeriodEnd: fromUnixTime(periodEnd),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: fromUnixTime(subscription.canceled_at),
    trialEnd: fromUnixTime(subscription.trial_end),
    raw: subscription,
  };
}

/**
 * Options for listing subscriptions
 */
export interface ListSubscriptionsOptions {
  customerId?: string;
  status?: Stripe.SubscriptionListParams.Status;
  limit?: number;
  startingAfter?: string;
}

/**
 * Options for cancelling a subscription
 */
export interface CancelSubscriptionOptions {
  /**
   * Cancel at the end of the current period instead of immediately.
   * @default false
   */
  atPeriodEnd?: boolean;
}

/**
 * Subscriptions service wrapping Stripe [Subscriptions](https://docs.stripe.com/api/subscriptions).
 *
 * Read methods return a {@link NormalizedSubscription}; the raw Stripe object is
 * always available on `.raw`.
 *
 * @example
 * ```typescript
 * const sub = await stripe.subscriptions.get('sub_123');
 * sub.currentPeriodEnd; // a JS Date
 * sub.priceId;          // 'price_…'
 * ```
 */
export class SubscriptionsService {
  constructor(private readonly client: Stripe) {}

  /**
   * Get a subscription by ID, normalized.
   */
  async get(subscriptionId: string): Promise<NormalizedSubscription> {
    try {
      const subscription = await this.client.subscriptions.retrieve(subscriptionId);
      return normalizeSubscription(subscription);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List subscriptions with cursor-based pagination, normalized.
   */
  async list(options?: ListSubscriptionsOptions): Promise<PaginatedResponse<NormalizedSubscription>> {
    try {
      const page = await this.client.subscriptions.list({
        customer: options?.customerId,
        status: options?.status,
        limit: options?.limit,
        starting_after: options?.startingAfter,
      });

      return {
        data: page.data.map(normalizeSubscription),
        hasMore: page.has_more,
        nextCursor: page.has_more ? page.data.at(-1)?.id : undefined,
      };
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Cancel a subscription, immediately or at period end.
   */
  async cancel(
    subscriptionId: string,
    options?: CancelSubscriptionOptions
  ): Promise<NormalizedSubscription> {
    try {
      const subscription = options?.atPeriodEnd
        ? await this.client.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
        : await this.client.subscriptions.cancel(subscriptionId);
      return normalizeSubscription(subscription);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Resume a subscription that was set to cancel at period end.
   */
  async resume(subscriptionId: string): Promise<NormalizedSubscription> {
    try {
      const subscription = await this.client.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      return normalizeSubscription(subscription);
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
