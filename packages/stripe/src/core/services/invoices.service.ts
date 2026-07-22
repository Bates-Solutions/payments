import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe Invoice
 */
export type Invoice = Stripe.Invoice;

/**
 * A persisted Stripe Invoice — one returned by the API, so its `id` is always
 * present. (`Stripe.Invoice.id` is typed optional in v18 because an invoice
 * object can appear inline without an id; anything this service returns has
 * been persisted and always has one.) Returning this lets callers chain, e.g.
 * `finalize((await create(...)).id)`, without a `string | undefined` error.
 */
export type PersistedInvoice = Invoice & { id: string };

/**
 * A Stripe Invoice Item (a pending line item drawn onto the next invoice, or
 * attached to a specific draft invoice).
 */
export type InvoiceItem = Stripe.InvoiceItem;

/**
 * Options for creating an invoice.
 */
export interface CreateInvoiceOptions {
  /** Customer the invoice is billed to */
  customerId: string;
  /**
   * Let Stripe automatically finalize and (for `charge_automatically`) pay the
   * invoice. Leave `false` to keep it a draft you finalize yourself.
   * @default false
   */
  autoAdvance?: boolean;
  /**
   * How the invoice is collected.
   * @default 'charge_automatically'
   */
  collectionMethod?: Stripe.InvoiceCreateParams.CollectionMethod;
  /** Days until due — only valid with `collectionMethod: 'send_invoice'` */
  daysUntilDue?: number;
  /** Arbitrary description shown on the invoice */
  description?: string;
  /** Attach the invoice to an existing subscription */
  subscriptionId?: string;
  /** Key/value metadata attached to the invoice */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for adding an invoice item.
 *
 * Provide either `amount` (+ `currency`) for an ad-hoc charge, or `priceId` to
 * bill an existing Price.
 */
export interface AddInvoiceItemOptions {
  /** Customer the item is billed to */
  customerId: string;
  /** Amount in the smallest currency unit (e.g. cents). Mutually exclusive with `priceId`. */
  amount?: number;
  /** ISO currency code (required with `amount`) */
  currency?: string;
  /** Existing Price to bill. Mutually exclusive with `amount`. */
  priceId?: string;
  /** Quantity (used with `priceId`) */
  quantity?: number;
  /**
   * Attach to a specific draft invoice. When omitted, the item is pending and
   * is drawn onto the customer's next invoice.
   */
  invoiceId?: string;
  /** Arbitrary description shown on the line item */
  description?: string;
  /** Key/value metadata attached to the invoice item */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for listing invoices.
 */
export interface ListInvoicesOptions {
  customerId?: string;
  subscriptionId?: string;
  status?: Stripe.InvoiceListParams.Status;
  limit?: number;
  startingAfter?: string;
}

/**
 * Invoices service wrapping Stripe [Invoices](https://docs.stripe.com/api/invoices)
 * and [Invoice Items](https://docs.stripe.com/api/invoiceitems).
 *
 * A typical flow: add items, create a draft invoice, finalize it, then either
 * let Stripe charge it automatically or `send` it for manual payment.
 *
 * @example
 * ```typescript
 * await stripe.invoices.addItem({ customerId: 'cus_1', amount: 4900, currency: 'usd' });
 * const draft = await stripe.invoices.create({ customerId: 'cus_1' });
 * const finalized = await stripe.invoices.finalize(draft.id);
 * await stripe.invoices.send(finalized.id);
 * ```
 */
export class InvoicesService {
  constructor(private readonly client: Stripe) {}

  /**
   * Create an invoice (a draft by default).
   *
   * @throws {StripeValidationError} When `customerId` is missing
   */
  async create(options: CreateInvoiceOptions): Promise<PersistedInvoice> {
    if (!options.customerId) {
      throw new StripeValidationError('customerId is required', 'customerId');
    }

    try {
      const invoice = await this.client.invoices.create(
        {
          customer: options.customerId,
          auto_advance: options.autoAdvance ?? false,
          collection_method: options.collectionMethod ?? 'charge_automatically',
          days_until_due: options.daysUntilDue,
          description: options.description,
          subscription: options.subscriptionId,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
      return invoice as PersistedInvoice;
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Add an invoice item — either to a specific draft invoice or pending on the
   * customer's next invoice.
   *
   * @throws {StripeValidationError} When `customerId` is missing, or neither
   * `amount` nor `priceId` is provided
   */
  async addItem(options: AddInvoiceItemOptions): Promise<InvoiceItem> {
    if (!options.customerId) {
      throw new StripeValidationError('customerId is required', 'customerId');
    }
    if (options.amount === undefined && !options.priceId) {
      throw new StripeValidationError('either amount or priceId is required', 'amount');
    }
    if (options.amount !== undefined && options.priceId) {
      throw new StripeValidationError('amount and priceId are mutually exclusive', 'amount');
    }
    if (options.amount !== undefined && !options.currency) {
      throw new StripeValidationError('currency is required when amount is provided', 'currency');
    }

    try {
      return await this.client.invoiceItems.create(
        {
          customer: options.customerId,
          amount: options.amount,
          currency: options.currency,
          // Stripe moved existing-price references onto `pricing.price` (older
          // API versions used a top-level `price`).
          pricing: options.priceId ? { price: options.priceId } : undefined,
          quantity: options.quantity,
          invoice: options.invoiceId,
          description: options.description,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Retrieve an invoice by ID.
   */
  async get(invoiceId: string): Promise<PersistedInvoice> {
    try {
      return (await this.client.invoices.retrieve(invoiceId)) as PersistedInvoice;
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List invoices with cursor-based pagination.
   */
  async list(options?: ListInvoicesOptions): Promise<PaginatedResponse<PersistedInvoice>> {
    try {
      const page = await this.client.invoices.list({
        customer: options?.customerId,
        subscription: options?.subscriptionId,
        status: options?.status,
        limit: options?.limit,
        starting_after: options?.startingAfter,
      });

      return {
        data: page.data as PersistedInvoice[],
        hasMore: page.has_more,
        nextCursor: page.has_more ? page.data.at(-1)?.id : undefined,
      };
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Finalize a draft invoice so it becomes payable.
   */
  async finalize(invoiceId: string): Promise<PersistedInvoice> {
    try {
      return (await this.client.invoices.finalizeInvoice(invoiceId)) as PersistedInvoice;
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Pay a finalized invoice.
   */
  async pay(invoiceId: string): Promise<PersistedInvoice> {
    try {
      return (await this.client.invoices.pay(invoiceId)) as PersistedInvoice;
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Void a finalized invoice (it can no longer be paid).
   */
  async voidInvoice(invoiceId: string): Promise<PersistedInvoice> {
    try {
      return (await this.client.invoices.voidInvoice(invoiceId)) as PersistedInvoice;
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Send an invoice to the customer for manual payment (`send_invoice`
   * collection). Emails a hosted invoice link.
   */
  async send(invoiceId: string): Promise<PersistedInvoice> {
    try {
      return (await this.client.invoices.sendInvoice(invoiceId)) as PersistedInvoice;
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
