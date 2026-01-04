import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { SubscriptionsService } from '../services/subscriptions.service.js';
import { SquareValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    subscriptions: {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      search: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('SubscriptionsService', () => {
  const defaultLocationId = 'LOC_123';

  describe('create', () => {
    it('should create a subscription', async () => {
      const mockSubscription = { id: 'SUB_123', status: 'ACTIVE' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client, defaultLocationId);
      const result = await service.create({
        customerId: 'CUST_123',
        planVariationId: 'PLAN_VAR_123',
      });

      expect(result).toEqual(mockSubscription);
    });

    it('should pass all optional fields', async () => {
      const mockSubscription = { id: 'SUB_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client, defaultLocationId);
      await service.create({
        customerId: 'CUST_123',
        planVariationId: 'PLAN_VAR_123',
        startDate: '2024-02-01',
        cardId: 'CARD_123',
        timezone: 'America/New_York',
        priceOverride: 1500,
        taxPercentage: '10',
      });

      expect(client.subscriptions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'CUST_123',
          planVariationId: 'PLAN_VAR_123',
          startDate: '2024-02-01',
          cardId: 'CARD_123',
          timezone: 'America/New_York',
          priceOverrideMoney: { amount: BigInt(1500), currency: 'USD' },
          taxPercentage: '10',
        })
      );
    });

    it('should throw for missing locationId', async () => {
      const client = createMockClient();
      const service = new SubscriptionsService(client);

      await expect(
        service.create({ customerId: 'CUST_123', planVariationId: 'PLAN_VAR_123' })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw for missing customerId', async () => {
      const client = createMockClient();
      const service = new SubscriptionsService(client, defaultLocationId);

      await expect(
        service.create({ customerId: '', planVariationId: 'PLAN_VAR_123' })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw for missing planVariationId', async () => {
      const client = createMockClient();
      const service = new SubscriptionsService(client, defaultLocationId);

      await expect(
        service.create({ customerId: 'CUST_123', planVariationId: '' })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw if subscription not created', async () => {
      const client = createMockClient({ create: vi.fn().mockResolvedValue({}) });

      const service = new SubscriptionsService(client, defaultLocationId);
      await expect(
        service.create({ customerId: 'CUST_123', planVariationId: 'PLAN_VAR_123' })
      ).rejects.toThrow('Subscription was not created');
    });
  });

  describe('get', () => {
    it('should get a subscription', async () => {
      const mockSubscription = { id: 'SUB_123' };
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client);
      const result = await service.get('SUB_123');

      expect(result).toEqual(mockSubscription);
    });

    it('should throw if not found', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({}) });

      const service = new SubscriptionsService(client);
      await expect(service.get('SUB_123')).rejects.toThrow('Subscription not found');
    });
  });

  describe('update', () => {
    it('should update a subscription', async () => {
      const mockSubscription = { id: 'SUB_123' };
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client);
      const result = await service.update('SUB_123', { priceOverride: 2000 });

      expect(result).toEqual(mockSubscription);
      expect(client.subscriptions.update).toHaveBeenCalledWith(
        expect.objectContaining({
          subscriptionId: 'SUB_123',
          subscription: {
            priceOverrideMoney: { amount: BigInt(2000), currency: 'USD' },
            cardId: undefined,
            taxPercentage: undefined,
          },
        })
      );
    });

    it('should throw if update fails', async () => {
      const client = createMockClient({ update: vi.fn().mockResolvedValue({}) });

      const service = new SubscriptionsService(client);
      await expect(service.update('SUB_123', {})).rejects.toThrow('Subscription update failed');
    });
  });

  describe('cancel', () => {
    it('should cancel a subscription', async () => {
      const mockSubscription = { id: 'SUB_123', status: 'CANCELED' };
      const client = createMockClient({
        cancel: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client);
      const result = await service.cancel('SUB_123');

      expect(result).toEqual(mockSubscription);
    });

    it('should throw if cancel fails', async () => {
      const client = createMockClient({ cancel: vi.fn().mockResolvedValue({}) });

      const service = new SubscriptionsService(client);
      await expect(service.cancel('SUB_123')).rejects.toThrow('Subscription cancellation failed');
    });
  });

  describe('pause', () => {
    it('should pause a subscription', async () => {
      const mockSubscription = { id: 'SUB_123', status: 'PAUSED' };
      const client = createMockClient({
        pause: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client);
      const result = await service.pause('SUB_123');

      expect(result).toEqual(mockSubscription);
    });

    it('should pass pause options', async () => {
      const mockSubscription = { id: 'SUB_123' };
      const client = createMockClient({
        pause: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client);
      await service.pause('SUB_123', {
        pauseEffectiveDate: '2024-03-01',
        pauseCycleDuration: 2,
      });

      expect(client.subscriptions.pause).toHaveBeenCalledWith({
        subscriptionId: 'SUB_123',
        pauseEffectiveDate: '2024-03-01',
        pauseCycleDuration: BigInt(2),
      });
    });

    it('should throw if pause fails', async () => {
      const client = createMockClient({ pause: vi.fn().mockResolvedValue({}) });

      const service = new SubscriptionsService(client);
      await expect(service.pause('SUB_123')).rejects.toThrow('Subscription pause failed');
    });
  });

  describe('resume', () => {
    it('should resume a subscription', async () => {
      const mockSubscription = { id: 'SUB_123', status: 'ACTIVE' };
      const client = createMockClient({
        resume: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client);
      const result = await service.resume('SUB_123');

      expect(result).toEqual(mockSubscription);
    });

    it('should pass resume date', async () => {
      const mockSubscription = { id: 'SUB_123' };
      const client = createMockClient({
        resume: vi.fn().mockResolvedValue({ subscription: mockSubscription }),
      });

      const service = new SubscriptionsService(client);
      await service.resume('SUB_123', '2024-04-01');

      expect(client.subscriptions.resume).toHaveBeenCalledWith({
        subscriptionId: 'SUB_123',
        resumeEffectiveDate: '2024-04-01',
      });
    });

    it('should throw if resume fails', async () => {
      const client = createMockClient({ resume: vi.fn().mockResolvedValue({}) });

      const service = new SubscriptionsService(client);
      await expect(service.resume('SUB_123')).rejects.toThrow('Subscription resume failed');
    });
  });

  describe('search', () => {
    it('should search subscriptions', async () => {
      const mockSubscriptions = [{ id: 'SUB_1' }];
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ subscriptions: mockSubscriptions, cursor: 'next' }),
      });

      const service = new SubscriptionsService(client);
      const result = await service.search();

      expect(result.data).toEqual(mockSubscriptions);
      expect(result.cursor).toBe('next');
    });

    it('should search by customerId', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ subscriptions: [] }),
      });

      const service = new SubscriptionsService(client);
      await service.search({ customerId: 'CUST_123' });

      expect(client.subscriptions.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { filter: { customerIds: ['CUST_123'] } },
        })
      );
    });

    it('should search by locationIds', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ subscriptions: [] }),
      });

      const service = new SubscriptionsService(client);
      await service.search({ locationIds: ['LOC_1', 'LOC_2'] });

      expect(client.subscriptions.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { filter: { locationIds: ['LOC_1', 'LOC_2'] } },
        })
      );
    });

    it('should return empty array when no subscriptions', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({}),
      });

      const service = new SubscriptionsService(client);
      const result = await service.search();

      expect(result.data).toEqual([]);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        search: vi.fn().mockRejectedValue({
          statusCode: 500,
          body: { errors: [{ category: 'API_ERROR', code: 'INTERNAL_SERVER_ERROR' }] },
        }),
      });

      const service = new SubscriptionsService(client);
      await expect(service.search()).rejects.toThrow();
    });
  });
});
