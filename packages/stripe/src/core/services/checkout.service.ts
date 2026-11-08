import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe Checkout Session
 */
export type CheckoutSession = Stripe.Checkout.Session;

/**
 * A line item for a Checkout Session (references an existing Price).
 */
export interface CheckoutLineItem {
  /** Price ID (e.g. `price_…`) */
  price: string;
  /** Quantity (default 1) */
  quantity?: number;
}

/**
 * Options for creating a Checkout Session
 */
export interface CreateCheckoutSessionOptions {
  /**
   * Checkout mode.
   * @default 'subscription'
   */
  mode?: Stripe.Checkout.SessionCreateParams.Mode;
  /** Line items (price + quantity) */
  lineItems: CheckoutLineItem[];
  /** URL to redirect to on success */
  successUrl: string;
  /** URL to redirect to on cancel */
  cancelUrl: string;
  /** Existing customer to attach the session to */
  customerId?: string;
  /** Prefill the email for a new customer (ignored when `customerId` is set) */
  customerEmail?: string;
  /** Your own reference id echoed back on the session */
  clientReferenceId?: string;
  /** Key/value metadata attached to the session */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for listing Checkout Sessions
 */
export interface ListCheckoutSessionsOptions {
  limit?: number;
  customerId?: string;
  subscriptionId?: string;
  startingAfter?: string;
}

/**
 * Checkout service wrapping Stripe [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions).
 *
 * @example
 * ```typescript
 * const session = await stripe.checkout.create({
 *   mode: 'subscription',
 *   customerId: 'cus_123',
 *   lineItems: [{ price: 'price_123', quantity: 1 }],
 *   successUrl: 'https://app.example.com/billing?success=true',
 *   cancelUrl: 'https://app.example.com/billing?canceled=true',
 * });
 *
 * redirect(session.url);
 * ```
 */
export class CheckoutService {
  constructor(private readonly client: Stripe) {}

  /**
   * Create a Checkout Session.
   *
   * @param options - Session creation options
   * @returns The created session (use `session.url` to redirect the customer)
   *
   * @throws {StripeValidationError} When required fields are missing
   */
  async create(options: CreateCheckoutSessionOptions): Promise<CheckoutSession> {
    // Optional chain guards JS callers who bypass the types and omit lineItems;
    // TS marks it required, so the chain is "unnecessary" only for typed callers.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options.lineItems?.length) {
      throw new StripeValidationError('lineItems must not be empty', 'lineItems');
    }
    if (!options.successUrl) {
      throw new StripeValidationError('successUrl is required', 'successUrl');
    }
    if (!options.cancelUrl) {
      throw new StripeValidationError('cancelUrl is required', 'cancelUrl');
    }

    try {
      return await this.client.checkout.sessions.create(
        {
          mode: options.mode ?? 'subscription',
          line_items: options.lineItems.map((item) => ({
            price: item.price,
            quantity: item.quantity ?? 1,
          })),
          success_url: options.successUrl,
          cancel_url: options.cancelUrl,
          customer: options.customerId,
          // Stripe rejects customer_email together with customer.
          customer_email: options.customerId ? undefined : options.customerEmail,
          client_reference_id: options.clientReferenceId,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Retrieve a Checkout Session by ID.
   */
  async get(sessionId: string): Promise<CheckoutSession> {
    try {
      return await this.client.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Expire an open Checkout Session so it can no longer be completed.
   */
  async expire(sessionId: string): Promise<CheckoutSession> {
    try {
      return await this.client.checkout.sessions.expire(sessionId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List Checkout Sessions with cursor-based pagination.
   */
  async list(options?: ListCheckoutSessionsOptions): Promise<PaginatedResponse<CheckoutSession>> {
    try {
      const page = await this.client.checkout.sessions.list({
        limit: options?.limit,
        customer: options?.customerId,
        subscription: options?.subscriptionId,
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
