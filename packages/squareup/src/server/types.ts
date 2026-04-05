/**
 * Square Webhook Event Types
 *
 * @see https://developer.squareup.com/reference/square/webhooks
 */

// Payment Events
export type PaymentEventType = 'payment.created' | 'payment.updated' | 'payment.completed';

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

// --- Typed webhook object payloads ---

/**
 * Payment object in a webhook event payload
 */
export interface PaymentWebhookObject {
  payment: {
    id: string;
    order_id?: string;
    customer_id?: string;
    amount_money?: { amount: number; currency: string };
    status: string;
    source_type?: string;
    location_id?: string;
    created_at?: string;
    updated_at?: string;
  };
}

/**
 * Order update object in a webhook event payload
 */
export interface OrderWebhookObject {
  order_update?: {
    order_id: string;
    state: string;
    version: number;
  };
}

/**
 * Refund object in a webhook event payload
 */
export interface RefundWebhookObject {
  refund: {
    id: string;
    payment_id: string;
    order_id?: string;
    amount_money?: { amount: number; currency: string };
    status: string;
  };
}

/**
 * Customer object in a webhook event payload
 */
export interface CustomerWebhookObject {
  customer?: {
    id: string;
    given_name?: string;
    family_name?: string;
    email_address?: string;
    phone_number?: string;
  };
}

/**
 * Typed webhook events for common event types
 */
export type PaymentWebhookEvent = WebhookEvent<PaymentWebhookObject> & {
  type: PaymentEventType;
};
export type OrderWebhookEvent = WebhookEvent<OrderWebhookObject> & {
  type: OrderEventType;
};
export type RefundWebhookEvent = WebhookEvent<RefundWebhookObject> & {
  type: RefundEventType;
};
export type CustomerWebhookEvent = WebhookEvent<CustomerWebhookObject> & {
  type: CustomerEventType;
};
