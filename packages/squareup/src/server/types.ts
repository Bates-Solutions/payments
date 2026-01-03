/**
 * Square Webhook Event Types
 *
 * @see https://developer.squareup.com/reference/square/webhooks
 */

// Payment Events
export type PaymentEventType = 'payment.created' | 'payment.updated';

// Refund Events
export type RefundEventType = 'refund.created' | 'refund.updated';

// Order Events
export type OrderEventType =
  | 'order.created'
  | 'order.updated'
  | 'order.fulfillment.updated';

// Customer Events
export type CustomerEventType =
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted';

// Subscription Events
export type SubscriptionEventType = 'subscription.created' | 'subscription.updated';

// Invoice Events
export type InvoiceEventType =
  | 'invoice.created'
  | 'invoice.updated'
  | 'invoice.published'
  | 'invoice.payment_made'
  | 'invoice.canceled';

// Loyalty Events
export type LoyaltyEventType =
  | 'loyalty.account.created'
  | 'loyalty.account.updated'
  | 'loyalty.program.created'
  | 'loyalty.promotion.created';

// Catalog Events
export type CatalogEventType = 'catalog.version.updated';

// Inventory Events
export type InventoryEventType = 'inventory.count.updated';

// Team Events
export type TeamEventType = 'team_member.created' | 'team_member.updated';

// Labor Events
export type LaborEventType = 'labor.timecard.created' | 'labor.timecard.updated';

/**
 * All Square webhook event types
 */
export type WebhookEventType =
  | PaymentEventType
  | RefundEventType
  | OrderEventType
  | CustomerEventType
  | SubscriptionEventType
  | InvoiceEventType
  | LoyaltyEventType
  | CatalogEventType
  | InventoryEventType
  | TeamEventType
  | LaborEventType;

/**
 * Base webhook event structure
 */
export interface WebhookEvent<T = unknown> {
  /** Unique ID for this event */
  event_id: string;
  /** Merchant ID that triggered the event */
  merchant_id: string;
  /** Type of event */
  type: WebhookEventType;
  /** When the event was created */
  created_at: string;
  /** Event data payload */
  data: {
    /** Type of object in the event */
    type: string;
    /** Unique ID of the object */
    id: string;
    /** The actual object data */
    object: T;
  };
}

/**
 * Handler function for webhook events
 */
export type WebhookHandler<T = unknown> = (
  event: WebhookEvent<T>
) => void | Promise<void>;

/**
 * Map of event types to their handlers
 */
export type WebhookHandlers = {
  [K in WebhookEventType]?: WebhookHandler;
};

/**
 * Configuration for webhook handling
 */
export interface WebhookConfig {
  /** Square webhook signature key */
  signatureKey: string;
  /** Event handlers by type */
  handlers: WebhookHandlers;
  /** URL where webhooks are received (for signature verification) */
  notificationUrl?: string;
  /**
   * Whether to throw on signature verification failure
   * @default true
   */
  throwOnInvalidSignature?: boolean;
}

/**
 * Result of webhook verification
 */
export interface WebhookVerificationResult {
  /** Whether the signature is valid */
  valid: boolean;
  /** Error message if invalid */
  error?: string;
}

/**
 * Parsed webhook request
 */
export interface ParsedWebhookRequest {
  /** The raw request body */
  rawBody: string;
  /** The signature from headers */
  signature: string;
  /** Parsed event data */
  event: WebhookEvent;
}
