import type Stripe from 'stripe';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe Billing Portal session
 */
export type BillingPortalSession = Stripe.BillingPortal.Session;

/**
 * Options for creating a Billing Portal session
 */
export interface CreatePortalSessionOptions {
  /** Customer to open the portal for */
  customerId: string;
  /** URL to return to after leaving the portal */
  returnUrl?: string;
  /** A specific portal configuration ID to use */
  configuration?: string;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Billing Portal service wrapping Stripe
 * [Billing Portal Sessions](https://docs.stripe.com/api/customer_portal/sessions).
 *
 * @example
 * ```typescript
 * const session = await stripe.billingPortal.create({
 *   customerId: 'cus_123',
 *   returnUrl: 'https://app.example.com/account',
 * });
 *
 * redirect(session.url);
 * ```
 */
export class BillingPortalService {
  constructor(private readonly client: Stripe) {}

  /**
   * Create a Billing Portal session for a customer.
   *
   * @param options - Session creation options
   * @returns The created session (use `session.url` to redirect the customer)
   *
   * @throws {StripeValidationError} When `customerId` is missing
   */
  async create(options: CreatePortalSessionOptions): Promise<BillingPortalSession> {
    if (!options.customerId) {
      throw new StripeValidationError('customerId is required', 'customerId');
    }

    try {
      return await this.client.billingPortal.sessions.create(
        {
          customer: options.customerId,
          return_url: options.returnUrl,
          configuration: options.configuration,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
