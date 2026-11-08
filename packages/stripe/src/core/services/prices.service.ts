import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey, resolveId } from '../utils.js';

/**
 * A Stripe Price
 */
export type Price = Stripe.Price;

/**
 * Options for listing prices
 */
export interface ListPricesOptions {
  /** Only return active (or inactive) prices */
  active?: boolean;
  /** Only return prices for this product */
  product?: string;
  limit?: number;
  startingAfter?: string;
  /**
   * Expand the related product inline (`price.product` becomes the full
   * `Stripe.Product` instead of an ID). Handy for reading product metadata.
   * @default false
   */
  expandProduct?: boolean;
}

/**
 * Billing interval for a recurring price.
 */
export interface PriceRecurring {
  /** How often the price is charged */
  interval: 'day' | 'week' | 'month' | 'year';
  /**
   * Number of intervals between charges (e.g. `3` with `month` is quarterly).
   * @default 1
   */
  intervalCount?: number;
}

/**
 * Options for creating a price
 */
export interface CreatePriceOptions {
  /** Product the price belongs to (`prod_…`) */
  product: string;
  /** Amount in the smallest currency unit (e.g. cents). A non-negative integer. */
  unitAmount: number;
  /** Lowercase ISO currency code (e.g. `usd`) */
  currency: string;
  /** Make it a recurring price. Omit for a one-time price. */
  recurring?: PriceRecurring;
  /** Internal label, not shown to customers */
  nickname?: string;
  /** Your own stable key for looking the price up (must be unique per account) */
  lookupKey?: string;
  /**
   * Move `lookupKey` from the price that currently holds it to this one.
   * @default false
   */
  transferLookupKey?: boolean;
  /**
   * Whether the price can be used for new purchases.
   * @default true
   */
  active?: boolean;
  /** Key/value metadata, e.g. your own id for the price */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for updating a price. A price's amount, currency and interval are
 * immutable; to change them use {@link PricesService.replace}.
 */
export interface UpdatePriceOptions {
  /** Deactivate (`false`) or reactivate (`true`) the price */
  active?: boolean;
  /** Internal label */
  nickname?: string;
  /** Your own stable key for looking the price up */
  lookupKey?: string;
  /** Move `lookupKey` from the price that currently holds it to this one */
  transferLookupKey?: boolean;
  /** Metadata to merge into the existing metadata. Set a key to `''` to remove it. */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for {@link PricesService.replace}. Anything you omit is copied from
 * the price being replaced.
 */
export interface ReplacePriceOptions {
  /** New amount in the smallest currency unit. A non-negative integer. */
  unitAmount: number;
  /** New currency (defaults to the old price's currency) */
  currency?: string;
  /** New interval (defaults to the old price's interval, if it was recurring) */
  recurring?: PriceRecurring;
  /** New nickname (defaults to the old one) */
  nickname?: string;
  /** New metadata (defaults to a copy of the old price's metadata) */
  metadata?: Record<string, string>;
  /**
   * Idempotency key for the whole replacement (defaults to a generated UUID).
   * Each underlying call uses a key derived from it, so retrying a failed
   * `replace` with the same key never creates a second new price.
   */
  idempotencyKey?: string;
}

/**
 * Result of {@link PricesService.replace}.
 */
export interface ReplacePriceResult {
  /** The newly created, active price */
  price: Price;
  /** The old price, now inactive */
  previous: Price;
}

function assertUnitAmount(unitAmount: unknown): void {
  if (typeof unitAmount !== 'number' || !Number.isInteger(unitAmount) || unitAmount < 0) {
    throw new StripeValidationError(
      'unitAmount must be a non-negative integer in the smallest currency unit',
      'unitAmount'
    );
  }
}

/**
 * Refuse prices that `replace` can't copy faithfully from a `unitAmount`.
 */
function assertReplaceable(old: Price): void {
  const refuse = (kind: string): never => {
    throw new StripeValidationError(`${kind} prices cannot be replaced`, 'priceId');
  };
  if (old.billing_scheme === 'tiered') refuse('tiered');
  if (old.recurring?.usage_type === 'metered' || old.recurring?.meter) refuse('metered');
  if (old.custom_unit_amount) refuse('custom amount');
  if (old.transform_quantity) refuse('transform_quantity');
  const extraCurrencies = Object.keys(old.currency_options ?? {}).filter(
    (currency) => currency !== old.currency
  );
  if (extraCurrencies.length > 0) refuse('multi-currency');
}

function toRecurringParams(
  recurring: PriceRecurring | undefined
): Stripe.PriceCreateParams.Recurring | undefined {
  if (!recurring) {
    return undefined;
  }
  return { interval: recurring.interval, interval_count: recurring.intervalCount };
}

/**
 * Prices service wrapping Stripe [Prices](https://docs.stripe.com/api/prices).
 *
 * Prices are immutable once created: to change an amount, create a new price
 * and deactivate the old one. {@link PricesService.replace} does both.
 *
 * @example
 * ```typescript
 * // List active prices with their product expanded (read product metadata)
 * const { data } = await stripe.prices.list({ active: true, expandProduct: true });
 * for (const price of data) {
 *   const product = price.product as Stripe.Product;
 *   console.log(product.metadata.tier, price.unit_amount, price.recurring?.interval);
 * }
 *
 * // Create a price, then change it later
 * const price = await stripe.prices.create({ product: 'prod_123', unitAmount: 899, currency: 'usd' });
 * const { price: newPrice } = await stripe.prices.replace(price.id, { unitAmount: 949 });
 * ```
 */
export class PricesService {
  constructor(private readonly client: Stripe) {}

  /**
   * List prices with cursor-based pagination.
   */
  async list(options?: ListPricesOptions): Promise<PaginatedResponse<Price>> {
    try {
      const page = await this.client.prices.list({
        active: options?.active,
        product: options?.product,
        limit: options?.limit,
        starting_after: options?.startingAfter,
        expand: options?.expandProduct ? ['data.product'] : undefined,
      });

      return {
        data: page.data,
        hasMore: page.has_more,
        nextCursor: page.has_more ? page.data.at(-1)?.id : undefined,
      };
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Retrieve a price by ID, optionally expanding its product.
   */
  async get(priceId: string, options?: { expandProduct?: boolean }): Promise<Price> {
    try {
      return await this.client.prices.retrieve(priceId, {
        expand: options?.expandProduct ? ['product'] : undefined,
      });
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Create a price for a product.
   *
   * @throws {StripeValidationError} When `product` or `currency` is missing, or
   * `unitAmount` is not a non-negative integer
   *
   * @example
   * ```typescript
   * // One-time price
   * await stripe.prices.create({ product: 'prod_123', unitAmount: 899, currency: 'usd' });
   *
   * // Monthly price
   * await stripe.prices.create({
   *   product: 'prod_123',
   *   unitAmount: 2900,
   *   currency: 'usd',
   *   recurring: { interval: 'month' },
   * });
   * ```
   */
  async create(options: CreatePriceOptions): Promise<Price> {
    if (!options.product) {
      throw new StripeValidationError('product is required', 'product');
    }
    assertUnitAmount(options.unitAmount);
    if (!options.currency) {
      throw new StripeValidationError('currency is required', 'currency');
    }

    try {
      return await this.client.prices.create(
        {
          product: options.product,
          unit_amount: options.unitAmount,
          currency: options.currency,
          recurring: toRecurringParams(options.recurring),
          nickname: options.nickname,
          lookup_key: options.lookupKey,
          transfer_lookup_key: options.transferLookupKey,
          active: options.active,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Update a price's mutable fields (active flag, nickname, lookup key,
   * metadata).
   *
   * @throws {StripeValidationError} When `priceId` is missing
   */
  async update(priceId: string, options: UpdatePriceOptions): Promise<Price> {
    if (!priceId) {
      throw new StripeValidationError('priceId is required', 'priceId');
    }

    try {
      return await this.client.prices.update(
        priceId,
        {
          active: options.active,
          nickname: options.nickname,
          lookup_key: options.lookupKey,
          transfer_lookup_key: options.transferLookupKey,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Deactivate a price (`active: false`) so it can't be used for new
   * purchases. Existing subscriptions on it keep working.
   *
   * @throws {StripeValidationError} When `priceId` is missing
   */
  async archive(priceId: string, options?: { idempotencyKey?: string }): Promise<Price> {
    return this.update(priceId, { active: false, idempotencyKey: options?.idempotencyKey });
  }

  /**
   * Change a price by replacing it: create a new price on the same product,
   * then deactivate the old one.
   *
   * Exactly these are copied from the old price unless you override them:
   * `currency`, `recurring.interval` and `recurring.interval_count`,
   * `nickname`, `metadata` and `tax_behavior`. Its `lookup_key` is moved to
   * the new price. If the old price was the product's default price, the new
   * price becomes the default first, since Stripe won't deactivate a default
   * price. Nothing else is copied.
   *
   * Only plain per-unit prices in one currency can be replaced. These are
   * refused with `StripeValidationError` rather than silently simplified:
   * tiered prices, metered prices (`usage_type: 'metered'` or a `meter`),
   * customer-chooses-the-amount prices (`custom_unit_amount`), prices with
   * `transform_quantity`, and prices with extra `currency_options`.
   *
   * Retry a failed call with the same `idempotencyKey`: each step uses a key
   * derived from it and sends the same parameters on every attempt, so a
   * retry finishes the remaining steps without creating a second price.
   *
   * @throws {StripeValidationError} When `priceId` is missing, `unitAmount` is
   * not a non-negative integer, or the old price is one of the kinds above
   *
   * @example
   * ```typescript
   * const { price, previous } = await stripe.prices.replace('price_old', {
   *   unitAmount: 949,
   *   idempotencyKey: `reprice-${sku}-${version}`,
   * });
   * ```
   */
  async replace(priceId: string, options: ReplacePriceOptions): Promise<ReplacePriceResult> {
    if (!priceId) {
      throw new StripeValidationError('priceId is required', 'priceId');
    }
    assertUnitAmount(options.unitAmount);

    const baseKey = options.idempotencyKey ?? createIdempotencyKey();

    try {
      const old = await this.client.prices.retrieve(priceId, {
        expand: ['product', 'currency_options'],
      });
      assertReplaceable(old);

      const productId = resolveId(old.product);
      if (!productId) {
        throw new StripeValidationError('price has no product', 'priceId');
      }

      const recurring =
        toRecurringParams(options.recurring) ??
        (old.recurring
          ? { interval: old.recurring.interval, interval_count: old.recurring.interval_count }
          : undefined);

      const price = await this.client.prices.create(
        {
          product: productId,
          unit_amount: options.unitAmount,
          currency: options.currency ?? old.currency,
          recurring,
          nickname: options.nickname ?? old.nickname ?? undefined,
          metadata: options.metadata ?? old.metadata,
          tax_behavior: old.tax_behavior ?? undefined,
        },
        // The lookup key is moved in its own step below, never here: after it
        // moves, a retry re-reads the old price without it, and this create
        // must send identical params to replay under the same key.
        { idempotencyKey: `${baseKey}:create` }
      );

      if (old.lookup_key) {
        await this.client.prices.update(
          price.id,
          { lookup_key: old.lookup_key, transfer_lookup_key: true },
          { idempotencyKey: `${baseKey}:lookup-key` }
        );
      }

      const product = old.product;
      if (
        typeof product === 'object' &&
        'default_price' in product &&
        resolveId(product.default_price) === old.id
      ) {
        await this.client.products.update(
          productId,
          { default_price: price.id },
          { idempotencyKey: `${baseKey}:default-price` }
        );
      }

      const previous = await this.client.prices.update(
        old.id,
        { active: false },
        { idempotencyKey: `${baseKey}:archive` }
      );

      return { price, previous };
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
