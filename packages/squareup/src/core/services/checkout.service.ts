import type {
  SquareClient,
  PaymentLink as SquarePaymentLink,
  CheckoutOptions as SquareCheckoutOptions,
  PrePopulatedData as SquarePrePopulatedData,
  QuickPay as SquareQuickPay,
  Order as SquareOrder,
} from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * Money representation for checkout
 */
export interface CheckoutMoney {
  amount?: bigint;
  currency?: string;
}

/**
 * Address for checkout
 */
export interface CheckoutAddress {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  locality?: string;
  sublocality?: string;
  administrativeDistrictLevel1?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Checkout options for payment links
 */
export interface CheckoutOptions {
  allowTipping?: boolean;
  customFields?: Array<{
    title: string;
  }>;
  subscriptionPlanId?: string;
  redirectUrl?: string;
  merchantSupportEmail?: string;
  askForShippingAddress?: boolean;
  acceptedPaymentMethods?: {
    applePay?: boolean;
    googlePay?: boolean;
    cashAppPay?: boolean;
    afterpayClearpay?: boolean;
  };
  appFeeMoney?: CheckoutMoney;
  shippingFee?: {
    name?: string;
    charge?: CheckoutMoney;
  };
  enableCoupon?: boolean;
  enableLoyalty?: boolean;
}

/**
 * Pre-populated data for checkout
 */
export interface PrePopulatedData {
  buyerEmail?: string;
  buyerPhoneNumber?: string;
  buyerAddress?: CheckoutAddress;
}

/**
 * Quick pay configuration for simple payment links
 */
export interface QuickPay {
  name: string;
  priceMoney: CheckoutMoney;
  locationId: string;
}

/**
 * Order line item for checkout
 */
export interface CheckoutLineItem {
  name?: string;
  quantity: string;
  itemType?: string;
  basePriceMoney?: CheckoutMoney;
  catalogObjectId?: string;
}

/**
 * Order configuration for checkout
 */
export interface CheckoutOrder {
  locationId: string;
  lineItems?: CheckoutLineItem[];
  referenceId?: string;
  customerId?: string;
}

/**
 * Payment link object from Square API
 */
export interface PaymentLink {
  id?: string;
  version?: number;
  description?: string;
  orderId?: string;
  checkoutOptions?: CheckoutOptions;
  prePopulatedData?: PrePopulatedData;
  url?: string;
  longUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  paymentNote?: string;
}

/**
 * Options for creating a payment link
 */
export interface CreatePaymentLinkOptions {
  idempotencyKey?: string;
  description?: string;
  quickPay?: QuickPay;
  order?: CheckoutOrder;
  checkoutOptions?: CheckoutOptions;
  prePopulatedData?: PrePopulatedData;
  paymentNote?: string;
}

/**
 * Options for updating a payment link
 */
export interface UpdatePaymentLinkOptions {
  paymentLink: {
    version: number;
    description?: string;
    checkoutOptions?: CheckoutOptions;
    prePopulatedData?: PrePopulatedData;
    paymentNote?: string;
  };
}

/**
 * Options for listing payment links
 */
export interface ListPaymentLinksOptions {
  cursor?: string;
  limit?: number;
}

/**
 * Payment links sub-service
 */
class PaymentLinksService {
  constructor(private readonly client: SquareClient) {}

  /**
   * Create a payment link
   *
   * @param options - Payment link creation options
   * @returns Created payment link
   *
   * @throws {SquareValidationError} When input validation fails
   *
   * @example
   * ```typescript
   * // Create with quick pay
   * const link = await square.checkout.paymentLinks.create({
   *   quickPay: {
   *     name: 'Auto Detailing',
   *     priceMoney: { amount: BigInt(1000), currency: 'USD' },
   *     locationId: 'LXXX',
   *   },
   *   checkoutOptions: {
   *     askForShippingAddress: true,
   *   },
   * });
   *
   * // Create with order
   * const link = await square.checkout.paymentLinks.create({
   *   order: {
   *     locationId: 'LXXX',
   *     lineItems: [
   *       { name: 'Product', quantity: '1', basePriceMoney: { amount: BigInt(1000), currency: 'USD' } },
   *     ],
   *   },
   * });
   * ```
   */
  async create(options: CreatePaymentLinkOptions): Promise<PaymentLink> {
    if (!options.quickPay && !options.order) {
      throw new SquareValidationError(
        'Either quickPay or order must be provided',
        'quickPay'
      );
    }

    try {
      const response = await this.client.checkout.paymentLinks.create({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        description: options.description,
        quickPay: options.quickPay as unknown as SquareQuickPay,
        order: options.order as unknown as SquareOrder,
        checkoutOptions: options.checkoutOptions as unknown as SquareCheckoutOptions,
        prePopulatedData: options.prePopulatedData as unknown as SquarePrePopulatedData,
        paymentNote: options.paymentNote,
      });

      if (!response.paymentLink) {
        throw new Error('Payment link was not created');
      }

      return response.paymentLink as PaymentLink;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a payment link by ID
   *
   * @param id - Payment link ID
   * @returns Payment link details
   *
   * @example
   * ```typescript
   * const link = await square.checkout.paymentLinks.get('LINK_123');
   * ```
   */
  async get(id: string): Promise<PaymentLink> {
    if (!id) {
      throw new SquareValidationError('id is required', 'id');
    }

    try {
      const response = await this.client.checkout.paymentLinks.get({ id });

      if (!response.paymentLink) {
        throw new Error('Payment link not found');
      }

      return response.paymentLink as PaymentLink;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Update a payment link
   *
   * @param id - Payment link ID to update
   * @param options - Update options including required version
   * @returns Updated payment link
   *
   * @example
   * ```typescript
   * const link = await square.checkout.paymentLinks.update('LINK_123', {
   *   paymentLink: {
   *     version: 1,
   *     description: 'Updated description',
   *     checkoutOptions: {
   *       askForShippingAddress: false,
   *     },
   *   },
   * });
   * ```
   */
  async update(id: string, options: UpdatePaymentLinkOptions): Promise<PaymentLink> {
    if (!id) {
      throw new SquareValidationError('id is required', 'id');
    }

    try {
      const response = await this.client.checkout.paymentLinks.update({
        id,
        paymentLink: options.paymentLink as unknown as SquarePaymentLink,
      });

      if (!response.paymentLink) {
        throw new Error('Payment link update failed');
      }

      return response.paymentLink as PaymentLink;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Delete a payment link
   *
   * @param id - Payment link ID to delete
   *
   * @example
   * ```typescript
   * await square.checkout.paymentLinks.delete('LINK_123');
   * ```
   */
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new SquareValidationError('id is required', 'id');
    }

    try {
      await this.client.checkout.paymentLinks.delete({ id });
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List payment links with optional pagination
   *
   * @param options - List options
   * @returns Array of payment links with optional cursor for pagination
   *
   * @example
   * ```typescript
   * // List all (up to limit)
   * const links = await square.checkout.paymentLinks.list({ limit: 50 });
   *
   * // Paginate through results
   * const firstPage = await square.checkout.paymentLinks.list({ limit: 10 });
   * if (firstPage.cursor) {
   *   const nextPage = await square.checkout.paymentLinks.list({
   *     limit: 10,
   *     cursor: firstPage.cursor,
   *   });
   * }
   * ```
   */
  async list(options?: ListPaymentLinksOptions): Promise<{
    data: PaymentLink[];
    cursor?: string;
  }> {
    try {
      const links: PaymentLink[] = [];
      const limit = options?.limit ?? 100;

      const page = await this.client.checkout.paymentLinks.list({
        cursor: options?.cursor,
        limit: options?.limit,
      });

      for await (const link of page) {
        links.push(link as PaymentLink);
        if (links.length >= limit) {
          break;
        }
      }

      return {
        data: links,
        cursor: undefined, // Pagination handled by iterator
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}

/**
 * Checkout service for Square Checkout API
 *
 * @example
 * ```typescript
 * const square = createSquareClient({ ... });
 *
 * // Create a payment link
 * const link = await square.checkout.paymentLinks.create({
 *   quickPay: {
 *     name: 'Auto Detailing',
 *     priceMoney: { amount: BigInt(5000), currency: 'USD' },
 *     locationId: 'LXXX',
 *   },
 *   checkoutOptions: {
 *     redirectUrl: 'https://example.com/confirmation',
 *     askForShippingAddress: true,
 *   },
 *   prePopulatedData: {
 *     buyerEmail: 'customer@example.com',
 *   },
 * });
 *
 * console.log('Checkout URL:', link.url);
 * ```
 */
export class CheckoutService {
  public readonly paymentLinks: PaymentLinksService;

  constructor(client: SquareClient) {
    this.paymentLinks = new PaymentLinksService(client);
  }
}
