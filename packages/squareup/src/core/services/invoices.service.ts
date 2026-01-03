import type { SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';
import type { CurrencyCode } from '../types/index.js';

/**
 * Invoice status types
 */
export type InvoiceStatus =
  | 'DRAFT'
  | 'UNPAID'
  | 'SCHEDULED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'CANCELED'
  | 'FAILED'
  | 'PAYMENT_PENDING';

/**
 * Invoice delivery method
 */
export type InvoiceDeliveryMethod = 'EMAIL' | 'SHARE_MANUALLY' | 'SMS';

/**
 * Invoice from Square API
 */
export interface Invoice {
  id?: string;
  version?: number;
  locationId?: string;
  orderId?: string;
  primaryRecipient?: {
    customerId?: string;
    givenName?: string;
    familyName?: string;
    emailAddress?: string;
    phoneNumber?: string;
  };
  paymentRequests?: Array<{
    uid?: string;
    requestType?: 'BALANCE' | 'DEPOSIT' | 'INSTALLMENT';
    dueDate?: string;
    tippingEnabled?: boolean;
    automaticPaymentSource?: 'NONE' | 'CARD_ON_FILE' | 'BANK_ON_FILE';
    cardId?: string;
    computedAmountMoney?: {
      amount?: bigint;
      currency?: string;
    };
  }>;
  deliveryMethod?: InvoiceDeliveryMethod;
  invoiceNumber?: string;
  title?: string;
  description?: string;
  scheduledAt?: string;
  publicUrl?: string;
  status?: InvoiceStatus;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Line item for invoice
 */
export interface InvoiceLineItem {
  name: string;
  quantity: number;
  amount: number;
  currency?: CurrencyCode;
  description?: string;
}

/**
 * Options for creating an invoice
 */
export interface CreateInvoiceOptions {
  customerId: string;
  locationId?: string;
  lineItems: InvoiceLineItem[];
  title?: string;
  description?: string;
  dueDate?: string;
  deliveryMethod?: InvoiceDeliveryMethod;
  invoiceNumber?: string;
  tippingEnabled?: boolean;
  idempotencyKey?: string;
}

/**
 * Invoices service for managing Square invoices
 *
 * @example
 * ```typescript
 * // Create an invoice
 * const invoice = await square.invoices.create({
 *   customerId: 'CUST_123',
 *   lineItems: [
 *     { name: 'Consulting', quantity: 2, amount: 15000 },
 *   ],
 *   dueDate: '2024-02-15',
 * });
 *
 * // Publish (send) the invoice
 * await square.invoices.publish(invoice.id, invoice.version);
 * ```
 */
export class InvoicesService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string
  ) {}

  /**
   * Create a draft invoice
   *
   * @param options - Invoice creation options
   * @returns Created invoice (in DRAFT status)
   *
   * @example
   * ```typescript
   * const invoice = await square.invoices.create({
   *   customerId: 'CUST_123',
   *   lineItems: [
   *     { name: 'Web Development', quantity: 10, amount: 10000 },
   *     { name: 'Design Services', quantity: 5, amount: 7500 },
   *   ],
   *   title: 'January Services',
   *   dueDate: '2024-02-01',
   *   deliveryMethod: 'EMAIL',
   * });
   * ```
   */
  async create(options: CreateInvoiceOptions): Promise<Invoice> {
    const locationId = options.locationId ?? this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    if (!options.customerId) {
      throw new SquareValidationError('customerId is required', 'customerId');
    }

    if (options.lineItems.length === 0) {
      throw new SquareValidationError('At least one line item is required', 'lineItems');
    }

    try {
      // First create an order for the invoice
      const orderResponse = await this.client.orders.create({
        order: {
          locationId,
          customerId: options.customerId,
          lineItems: options.lineItems.map((item) => ({
            name: item.name,
            quantity: String(item.quantity),
            basePriceMoney: {
              amount: BigInt(item.amount),
              currency: item.currency ?? 'USD',
            },
            note: item.description,
          })),
        },
        idempotencyKey: createIdempotencyKey(),
      });

      if (!orderResponse.order?.id) {
        throw new Error('Failed to create order for invoice');
      }

      // Create the invoice
      const response = await this.client.invoices.create({
        invoice: {
          locationId,
          orderId: orderResponse.order.id,
          primaryRecipient: {
            customerId: options.customerId,
          },
          title: options.title,
          description: options.description,
          invoiceNumber: options.invoiceNumber,
          deliveryMethod: options.deliveryMethod ?? 'EMAIL',
          paymentRequests: [
            {
              requestType: 'BALANCE',
              dueDate: options.dueDate,
              tippingEnabled: options.tippingEnabled ?? false,
            },
          ],
        },
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
      });

      if (!response.invoice) {
        throw new Error('Invoice was not created');
      }

      return response.invoice as Invoice;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get an invoice by ID
   *
   * @param invoiceId - Invoice ID
   * @returns Invoice details
   *
   * @example
   * ```typescript
   * const invoice = await square.invoices.get('INV_123');
   * ```
   */
  async get(invoiceId: string): Promise<Invoice> {
    try {
      const response = await this.client.invoices.get({ invoiceId });

      if (!response.invoice) {
        throw new Error('Invoice not found');
      }

      return response.invoice as Invoice;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Publish (send) an invoice
   *
   * @param invoiceId - Invoice ID
   * @param version - Invoice version (for optimistic concurrency)
   * @returns Published invoice
   *
   * @example
   * ```typescript
   * const invoice = await square.invoices.publish('INV_123', 0);
   * console.log(`Invoice sent: ${invoice.publicUrl}`);
   * ```
   */
  async publish(invoiceId: string, version: number): Promise<Invoice> {
    try {
      const response = await this.client.invoices.publish({
        invoiceId,
        version,
        idempotencyKey: createIdempotencyKey(),
      });

      if (!response.invoice) {
        throw new Error('Invoice publish failed');
      }

      return response.invoice as Invoice;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Cancel an invoice
   *
   * @param invoiceId - Invoice ID
   * @param version - Invoice version (for optimistic concurrency)
   * @returns Cancelled invoice
   *
   * @example
   * ```typescript
   * const invoice = await square.invoices.cancel('INV_123', 1);
   * ```
   */
  async cancel(invoiceId: string, version: number): Promise<Invoice> {
    try {
      const response = await this.client.invoices.cancel({
        invoiceId,
        version,
      });

      if (!response.invoice) {
        throw new Error('Invoice cancellation failed');
      }

      return response.invoice as Invoice;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Update an invoice
   *
   * @param invoiceId - Invoice ID
   * @param version - Invoice version (for optimistic concurrency)
   * @param options - Update options
   * @returns Updated invoice
   *
   * @example
   * ```typescript
   * const invoice = await square.invoices.update('INV_123', 0, {
   *   title: 'Updated Title',
   * });
   * ```
   */
  async update(
    invoiceId: string,
    version: number,
    options: {
      title?: string;
      description?: string;
      dueDate?: string;
    }
  ): Promise<Invoice> {
    try {
      const fieldsToClear: string[] = [];
      if (options.title === '') fieldsToClear.push('title');
      if (options.description === '') fieldsToClear.push('description');

      const response = await this.client.invoices.update({
        invoiceId,
        invoice: {
          version,
          title: options.title ?? undefined,
          description: options.description ?? undefined,
          paymentRequests: options.dueDate
            ? [
                {
                  requestType: 'BALANCE',
                  dueDate: options.dueDate,
                },
              ]
            : undefined,
        },
        idempotencyKey: createIdempotencyKey(),
        fieldsToClear: fieldsToClear.length > 0 ? fieldsToClear : undefined,
      });

      if (!response.invoice) {
        throw new Error('Invoice update failed');
      }

      return response.invoice as Invoice;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Delete a draft invoice
   *
   * @param invoiceId - Invoice ID
   * @param version - Invoice version
   *
   * @example
   * ```typescript
   * await square.invoices.delete('INV_123', 0);
   * ```
   */
  async delete(invoiceId: string, version: number): Promise<void> {
    try {
      await this.client.invoices.delete({ invoiceId, version });
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Search for invoices
   *
   * @param options - Search options
   * @returns Matching invoices with pagination
   *
   * @example
   * ```typescript
   * const results = await square.invoices.search({
   *   customerId: 'CUST_123',
   * });
   * ```
   */
  async search(options?: {
    locationIds?: string[];
    customerId?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ data: Invoice[]; cursor?: string }> {
    const locationIds =
      options?.locationIds ?? (this.defaultLocationId ? [this.defaultLocationId] : []);

    if (locationIds.length === 0) {
      throw new SquareValidationError('At least one locationId is required for search');
    }

    try {
      const response = await this.client.invoices.search({
        query: {
          filter: {
            locationIds,
            customerIds: options?.customerId ? [options.customerId] : undefined,
          },
        },
        cursor: options?.cursor,
        limit: options?.limit,
      });

      return {
        data: (response.invoices ?? []) as Invoice[],
        cursor: response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
