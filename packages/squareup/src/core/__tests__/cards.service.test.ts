import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { CardsService } from '../services/cards.service.js';
import { SquareApiError, SquarePaymentError, SquareValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    cards: {
      create: vi.fn(),
      get: vi.fn(),
      list: vi.fn(),
      disable: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

const mockCard = {
  id: 'ccof:CARD_123',
  cardBrand: 'VISA',
  last4: '1111',
  customerId: 'CUST_123',
  enabled: true,
};

describe('CardsService', () => {
  describe('create', () => {
    it('should store a card with every option', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ card: mockCard }),
      });
      const service = new CardsService(client);

      const result = await service.create({
        sourceId: 'cnon:card-nonce-ok',
        customerId: 'CUST_123',
        idempotencyKey: 'key-1',
        cardholderName: 'Amelia Earhart',
        billingAddress: { postalCode: '94103', country: 'US' },
        referenceId: 'user-42',
      });

      expect(result).toEqual(mockCard);
      expect(client.cards.create).toHaveBeenCalledWith({
        idempotencyKey: 'key-1',
        sourceId: 'cnon:card-nonce-ok',
        card: {
          customerId: 'CUST_123',
          cardholderName: 'Amelia Earhart',
          billingAddress: { postalCode: '94103', country: 'US' },
          referenceId: 'user-42',
        },
      });
    });

    it.each(['sourceId', 'customerId', 'idempotencyKey'] as const)(
      'should throw a SquareValidationError naming %s when it is empty',
      async (field) => {
        const client = createMockClient();
        const service = new CardsService(client);
        const options = {
          sourceId: 'cnon:card-nonce-ok',
          customerId: 'CUST_123',
          idempotencyKey: 'key-1',
          [field]: '',
        };

        const error: unknown = await service.create(options).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(SquareValidationError);
        expect((error as SquareValidationError).field).toBe(field);
        expect(client.cards.create).not.toHaveBeenCalled();
      }
    );

    it('should throw when idempotencyKey is omitted at runtime', async () => {
      const client = createMockClient();
      const service = new CardsService(client);
      const options = { sourceId: 'cnon:card-nonce-ok', customerId: 'CUST_123' };

      // Untyped JavaScript callers can still leave the key out.
      await expect(
        service.create(options as unknown as Parameters<CardsService['create']>[0])
      ).rejects.toThrow('idempotencyKey is required');
      expect(client.cards.create).not.toHaveBeenCalled();
    });

    it('should throw when no card is returned', async () => {
      const client = createMockClient({ create: vi.fn().mockResolvedValue({}) });
      const service = new CardsService(client);

      await expect(
        service.create({ sourceId: 's', customerId: 'c', idempotencyKey: 'k' })
      ).rejects.toThrow('Card was not created');
    });

    it('should surface a decline as a SquarePaymentError', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: {
            errors: [
              { category: 'PAYMENT_METHOD_ERROR', code: 'CVV_FAILURE', detail: 'CVV failed' },
            ],
          },
        }),
      });
      const service = new CardsService(client);

      await expect(
        service.create({ sourceId: 's', customerId: 'c', idempotencyKey: 'k' })
      ).rejects.toBeInstanceOf(SquarePaymentError);
    });

    it('should throw on errors in a 200 response', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({
          errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'INVALID_VALUE', detail: 'bad' }],
        }),
      });
      const service = new CardsService(client);

      await expect(
        service.create({ sourceId: 's', customerId: 'c', idempotencyKey: 'k' })
      ).rejects.toBeInstanceOf(SquareApiError);
    });
  });

  describe('get', () => {
    it('should get a card by ID', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({ card: mockCard }) });
      const service = new CardsService(client);

      await expect(service.get('ccof:CARD_123')).resolves.toEqual(mockCard);
      expect(client.cards.get).toHaveBeenCalledWith({ cardId: 'ccof:CARD_123' });
    });

    it('should throw when the card is not found', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({}) });
      const service = new CardsService(client);

      await expect(service.get('ccof:CARD_123')).rejects.toThrow('Card not found');
    });

    it('should require a card ID', async () => {
      const client = createMockClient();
      const service = new CardsService(client);

      await expect(service.get('')).rejects.toBeInstanceOf(SquareValidationError);
      expect(client.cards.get).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('should pass the filters and return one page', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ response: { cards: [mockCard], cursor: 'next' } }),
      });
      const service = new CardsService(client);

      const result = await service.list({
        customerId: 'CUST_123',
        includeDisabled: true,
        cursor: 'prev',
      });

      expect(result).toEqual({ cards: [mockCard], cursor: 'next' });
      expect(client.cards.list).toHaveBeenCalledWith({
        customerId: 'CUST_123',
        includeDisabled: true,
        cursor: 'prev',
      });
    });

    it('should default to an empty page', async () => {
      const client = createMockClient({ list: vi.fn().mockResolvedValue({ response: {} }) });
      const service = new CardsService(client);

      await expect(service.list()).resolves.toEqual({ cards: [], cursor: undefined });
    });

    it('should throw on errors in the page response', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: {
            errors: [{ category: 'AUTHENTICATION_ERROR', code: 'INSUFFICIENT_SCOPES' }],
          },
        }),
      });
      const service = new CardsService(client);

      await expect(service.list()).rejects.toBeInstanceOf(SquareApiError);
    });
  });

  describe('disable', () => {
    it('should disable a card', async () => {
      const disabled = { ...mockCard, enabled: false };
      const client = createMockClient({
        disable: vi.fn().mockResolvedValue({ card: disabled }),
      });
      const service = new CardsService(client);

      await expect(service.disable('ccof:CARD_123')).resolves.toEqual(disabled);
      expect(client.cards.disable).toHaveBeenCalledWith({ cardId: 'ccof:CARD_123' });
    });

    it('should throw when no card is returned', async () => {
      const client = createMockClient({ disable: vi.fn().mockResolvedValue({}) });
      const service = new CardsService(client);

      await expect(service.disable('ccof:CARD_123')).rejects.toThrow('Card disable failed');
    });

    it('should require a card ID', async () => {
      const service = new CardsService(createMockClient());

      await expect(service.disable('')).rejects.toBeInstanceOf(SquareValidationError);
    });
  });
});
