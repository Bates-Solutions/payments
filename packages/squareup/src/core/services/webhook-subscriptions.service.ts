import type { Square, SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A webhook subscription as returned by `get`, `list`, and `update`.
 *
 * Note the absence of `signatureKey`: Square only returns the signature key
 * **once, on creation**. Persist it then — see {@link CreatedWebhookSubscription}.
 * A later `get`/`list` never includes it; to recover a usable key without
 * losing the subscription, rotate it with {@link WebhookSubscriptionsService.rotateSignatureKey}.
 */
export type WebhookSubscription = Omit<Square.WebhookSubscription, 'signatureKey'>;

/**
 * A webhook subscription as returned by `create`, where `signatureKey` is
 * present and must be persisted immediately — it is never returned again.
 */
export type CreatedWebhookSubscription = Square.WebhookSubscription & {
  signatureKey: string;
};

/**
 * Result of sending a test event to a subscription.
 */
export type SubscriptionTestResult = Square.SubscriptionTestResult;

/**
 * Options for creating a webhook subscription.
 */
export interface CreateWebhookSubscriptionOptions {
  /** A name for the subscription */
  name: string;
  /** Event types to subscribe to, e.g. `['payment.updated', 'order.updated']` */
  eventTypes: string[];
  /** The URL Square will POST events to */
  notificationUrl: string;
  /** Square API version used to serialize events (defaults to the app's version) */
  apiVersion?: string;
  /** Whether the subscription is enabled (default `true`) */
  enabled?: boolean;
  idempotencyKey?: string;
}

/**
 * Options for updating a webhook subscription. Only the provided fields change.
 */
export interface UpdateWebhookSubscriptionOptions {
  name?: string;
  notificationUrl?: string;
  eventTypes?: string[];
  enabled?: boolean;
}

/**
 * Options for listing webhook subscriptions.
 */
export interface ListWebhookSubscriptionsOptions {
  cursor?: string;
  /** Include disabled subscriptions (default only returns enabled) */
  includeDisabled?: boolean;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
}

/**
 * Manage Square webhook subscriptions (create / list / get / update / delete /
 * test / rotate signature key). Exposed as `square.webhooks.subscriptions`.
 *
 * @example
 * ```typescript
 * // Idempotent create: list first, don't duplicate by URL
 * const { data } = await square.webhooks.subscriptions.list();
 * const existing = data.find((s) => s.notificationUrl === url);
 *
 * const created = await square.webhooks.subscriptions.create({
 *   name: 'platform-order-events',
 *   eventTypes: ['payment.updated', 'order.updated', 'refund.updated'],
 *   notificationUrl: url,
 * });
 * created.signatureKey; // present here ONLY — persist it now
 * ```
 */
export class WebhookSubscriptionsService {
  constructor(private readonly client: SquareClient) {}

  /**
   * Create a webhook subscription.
   *
   * @returns The created subscription, **including its `signatureKey`** — which
   * Square returns only here. Persist it immediately.
   *
   * @throws {SquareValidationError} When required fields are missing
   */
  async create(options: CreateWebhookSubscriptionOptions): Promise<CreatedWebhookSubscription> {
    if (!options.name) {
      throw new SquareValidationError('name is required', 'name');
    }
    if (!options.notificationUrl) {
      throw new SquareValidationError('notificationUrl is required', 'notificationUrl');
    }
    if (options.eventTypes.length === 0) {
      throw new SquareValidationError('At least one event type is required', 'eventTypes');
    }

    try {
      const response = await this.client.webhooks.subscriptions.create({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        subscription: {
          name: options.name,
          eventTypes: options.eventTypes,
          notificationUrl: options.notificationUrl,
          apiVersion: options.apiVersion,
          enabled: options.enabled ?? true,
        },
      });

      if (!response.subscription) {
        throw new Error('Webhook subscription was not created');
      }

      // Square populates signatureKey on creation only; assert it here.
      return response.subscription as CreatedWebhookSubscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List webhook subscriptions with cursor-based pagination.
   */
  async list(
    options?: ListWebhookSubscriptionsOptions
  ): Promise<{ data: WebhookSubscription[]; cursor?: string }> {
    try {
      // list() returns a pager; the raw response body is on `.response`.
      const page = await this.client.webhooks.subscriptions.list({
        cursor: options?.cursor,
        includeDisabled: options?.includeDisabled,
        sortOrder: options?.sortOrder,
        limit: options?.limit,
      });

      return {
        data: page.response.subscriptions ?? [],
        cursor: page.response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a webhook subscription by ID. The result never includes `signatureKey`.
   */
  async get(subscriptionId: string): Promise<WebhookSubscription> {
    try {
      const response = await this.client.webhooks.subscriptions.get({ subscriptionId });

      if (!response.subscription) {
        throw new Error('Webhook subscription not found');
      }

      return response.subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Update a webhook subscription (name, URL, event set, or enabled state).
   */
  async update(
    subscriptionId: string,
    options: UpdateWebhookSubscriptionOptions
  ): Promise<WebhookSubscription> {
    try {
      const response = await this.client.webhooks.subscriptions.update({
        subscriptionId,
        subscription: {
          name: options.name,
          notificationUrl: options.notificationUrl,
          eventTypes: options.eventTypes,
          enabled: options.enabled,
        },
      });

      if (!response.subscription) {
        throw new Error('Webhook subscription update failed');
      }

      return response.subscription;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Delete a webhook subscription.
   */
  async delete(subscriptionId: string): Promise<void> {
    try {
      await this.client.webhooks.subscriptions.delete({ subscriptionId });
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Send a test event to a subscription to verify the endpoint.
   *
   * @param subscriptionId - Subscription to test
   * @param options - Optional specific event type to send
   */
  async test(
    subscriptionId: string,
    options?: { eventType?: string }
  ): Promise<SubscriptionTestResult> {
    try {
      const response = await this.client.webhooks.subscriptions.test({
        subscriptionId,
        eventType: options?.eventType,
      });

      // The result may come nested under `subscriptionTestResult` or as the
      // same fields at the response root; normalize both to one shape.
      return (
        response.subscriptionTestResult ?? {
          statusCode: response.statusCode,
          passesFilter: response.passesFilter,
          payload: response.payload,
          notificationUrl: response.notificationUrl,
        }
      );
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Rotate a subscription's signature key, returning a **new** key.
   *
   * Useful when the original key (returned only from {@link create}) wasn't
   * persisted — rotate to obtain a usable key without deleting/recreating the
   * subscription. Rotating invalidates the previous key, so deploy the new key
   * before Square signs the next delivery with it.
   */
  async rotateSignatureKey(
    subscriptionId: string,
    options?: { idempotencyKey?: string }
  ): Promise<{ signatureKey?: string }> {
    try {
      const response = await this.client.webhooks.subscriptions.updateSignatureKey({
        subscriptionId,
        idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey(),
      });

      return { signatureKey: response.signatureKey };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
