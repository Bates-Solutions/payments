import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe SetupIntent
 */
export type SetupIntent = Stripe.SetupIntent;

/**
 * Options for creating a SetupIntent
 */
export interface CreateSetupIntentOptions {
  /** Customer the saved payment method is attached to on success */
  customerId?: string;
  /**
   * How the saved payment method will be used. `off_session` (charging the
   * customer when they aren't present) asks for the authentication needed up
   * front.
   * @default 'off_session'
   */
  usage?: 'off_session' | 'on_session';
  /**
   * Payment method types to accept, e.g. `['card']`. When omitted, Stripe
   * uses the types enabled in your Dashboard (automatic payment methods).
   */
  paymentMethodTypes?: string[];
  /** An existing payment method to set up (e.g. from Stripe.js) */
  paymentMethod?: string;
  /**
   * Confirm immediately. Requires `paymentMethod`.
   * @default false
   */
  confirm?: boolean;
  /**
   * Where to send the customer after a redirect-based authentication. Only
   * used when confirming here, so it requires `confirm: true`.
   */
  returnUrl?: string;
  /** Arbitrary description */
  description?: string;
  /** Key/value metadata */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for listing SetupIntents
 */
export interface ListSetupIntentsOptions {
  customerId?: string;
  paymentMethodId?: string;
  limit?: number;
  startingAfter?: string;
}

function requireId(value: string | undefined, field: string): void {
  if (!value) {
    throw new StripeValidationError(`${field} is required`, field);
  }
}

/**
 * SetupIntents service wrapping Stripe
 * [SetupIntents](https://docs.stripe.com/api/setup_intents): save a payment
 * method for later without charging it now.
 *
 * Typical flow: create a SetupIntent on the server, pass its `client_secret`
 * to Stripe.js to collect and confirm the card, then charge the saved payment
 * method off-session later with `payments.create`.
 *
 * @example
 * ```typescript
 * const intent = await stripe.setupIntents.create({ customerId: 'cus_123' });
 * return { clientSecret: intent.client_secret };
 * ```
 */
export class SetupIntentsService {
  constructor(private readonly client: Stripe) {}

  /**
   * Create a SetupIntent.
   *
   * @throws {StripeValidationError} When `confirm` is set without `paymentMethod`,
   *   or `returnUrl` is set without `confirm`
   */
  async create(options?: CreateSetupIntentOptions): Promise<SetupIntent> {
    if (options?.returnUrl && !options.confirm) {
      throw new StripeValidationError('returnUrl requires confirm: true', 'returnUrl');
    }
    if (options?.confirm && !options.paymentMethod) {
      throw new StripeValidationError(
        'paymentMethod is required when confirm is true',
        'paymentMethod'
      );
    }

    try {
      return await this.client.setupIntents.create(
        {
          customer: options?.customerId,
          usage: options?.usage ?? 'off_session',
          payment_method_types: options?.paymentMethodTypes,
          automatic_payment_methods: options?.paymentMethodTypes ? undefined : { enabled: true },
          payment_method: options?.paymentMethod,
          confirm: options?.confirm,
          return_url: options?.returnUrl,
          description: options?.description,
          metadata: options?.metadata,
        },
        { idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Retrieve a SetupIntent by ID.
   *
   * @throws {StripeValidationError} When `setupIntentId` is missing
   */
  async get(setupIntentId: string): Promise<SetupIntent> {
    requireId(setupIntentId, 'setupIntentId');
    try {
      return await this.client.setupIntents.retrieve(setupIntentId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Confirm a SetupIntent on the server (usually Stripe.js confirms it in the
   * browser instead).
   *
   * @throws {StripeValidationError} When `setupIntentId` is missing
   */
  async confirm(
    setupIntentId: string,
    options?: { paymentMethod?: string; returnUrl?: string; idempotencyKey?: string }
  ): Promise<SetupIntent> {
    requireId(setupIntentId, 'setupIntentId');
    try {
      return await this.client.setupIntents.confirm(
        setupIntentId,
        { payment_method: options?.paymentMethod, return_url: options?.returnUrl },
        { idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Cancel a SetupIntent that hasn't succeeded.
   *
   * @throws {StripeValidationError} When `setupIntentId` is missing
   */
  async cancel(
    setupIntentId: string,
    options?: {
      reason?: Stripe.SetupIntentCancelParams.CancellationReason;
      idempotencyKey?: string;
    }
  ): Promise<SetupIntent> {
    requireId(setupIntentId, 'setupIntentId');
    try {
      return await this.client.setupIntents.cancel(
        setupIntentId,
        { cancellation_reason: options?.reason },
        { idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List SetupIntents with cursor-based pagination.
   */
  async list(options?: ListSetupIntentsOptions): Promise<PaginatedResponse<SetupIntent>> {
    try {
      const page = await this.client.setupIntents.list({
        customer: options?.customerId,
        payment_method: options?.paymentMethodId,
        limit: options?.limit,
        starting_after: options?.startingAfter,
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
}
