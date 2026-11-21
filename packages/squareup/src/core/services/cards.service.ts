import type { SquareClient } from 'square';
import type { Card, CreateCardOptions, ListCardsOptions } from '../types/index.js';
import { assertNoResponseErrors, parseSquareError, requireNonEmpty } from '../errors.js';

/**
 * Cards on file: store a customer's card, then charge it later with
 * `payments.create({ sourceId: card.id, customerId, ... })`.
 *
 * @example
 * ```typescript
 * const card = await square.cards.create({
 *   sourceId: 'cnon:card-nonce-ok',
 *   customerId: 'CUST_123',
 *   idempotencyKey: 'save-card-CUST_123',
 * });
 *
 * await square.cards.disable(card.id!);
 * ```
 */
export class CardsService {
  constructor(private readonly client: SquareClient) {}

  /**
   * Store a card on file for a customer
   *
   * @param options - Card creation options
   * @returns The stored card
   *
   * @throws {SquareValidationError} When `sourceId`, `customerId` or `idempotencyKey` is missing
   * @throws {SquarePaymentError} When Square declines to store the card
   *
   * @example
   * ```typescript
   * const card = await square.cards.create({
   *   sourceId: 'cnon:card-nonce-ok',
   *   customerId: 'CUST_123',
   *   idempotencyKey: 'store-card-user-42',
   *   cardholderName: 'Amelia Earhart',
   *   billingAddress: { postalCode: '94103', country: 'US' },
   *   referenceId: 'user-42',
   * });
   * ```
   */
  async create(options: CreateCardOptions): Promise<Card> {
    requireNonEmpty(options.sourceId, 'sourceId');
    requireNonEmpty(options.customerId, 'customerId');
    requireNonEmpty(options.idempotencyKey, 'idempotencyKey');

    try {
      const response = await this.client.cards.create({
        idempotencyKey: options.idempotencyKey,
        sourceId: options.sourceId,
        card: {
          customerId: options.customerId,
          cardholderName: options.cardholderName,
          billingAddress: options.billingAddress,
          referenceId: options.referenceId,
        },
      });
      assertNoResponseErrors(response);

      if (!response.card) {
        throw new Error('Card was not created');
      }

      return response.card;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a card by ID
   *
   * @param cardId - Card ID
   * @returns Card details
   *
   * @example
   * ```typescript
   * const card = await square.cards.get('ccof:CARD_123');
   * ```
   */
  async get(cardId: string): Promise<Card> {
    requireNonEmpty(cardId, 'cardId');

    try {
      const response = await this.client.cards.get({ cardId });
      assertNoResponseErrors(response);

      if (!response.card) {
        throw new Error('Card not found');
      }

      return response.card;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List cards on file, one page at a time
   *
   * @param options - Filters and the cursor of the page to fetch
   * @returns One page of cards, and the cursor of the next page if there is one
   *
   * @example
   * ```typescript
   * const page1 = await square.cards.list({ customerId: 'CUST_123' });
   * const page2 = await square.cards.list({ customerId: 'CUST_123', cursor: page1.cursor });
   * ```
   */
  async list(options?: ListCardsOptions): Promise<{ cards: Card[]; cursor?: string }> {
    try {
      const page = await this.client.cards.list({
        customerId: options?.customerId,
        includeDisabled: options?.includeDisabled,
        cursor: options?.cursor,
      });
      assertNoResponseErrors(page.response);

      return {
        cards: page.response.cards ?? [],
        cursor: page.response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Disable a card on file. A disabled card cannot be charged or enabled again.
   *
   * @param cardId - Card ID
   * @returns The disabled card (`enabled: false`)
   *
   * @example
   * ```typescript
   * await square.cards.disable('ccof:CARD_123');
   * ```
   */
  async disable(cardId: string): Promise<Card> {
    requireNonEmpty(cardId, 'cardId');

    try {
      const response = await this.client.cards.disable({ cardId });
      assertNoResponseErrors(response);

      if (!response.card) {
        throw new Error('Card disable failed');
      }

      return response.card;
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
