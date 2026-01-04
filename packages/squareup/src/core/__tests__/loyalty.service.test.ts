import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { LoyaltyService } from '../services/loyalty.service.js';
import { SquareValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    loyalty: {
      programs: {
        get: vi.fn(),
        list: vi.fn(),
        calculate: vi.fn(),
      },
      accounts: {
        create: vi.fn(),
        get: vi.fn(),
        search: vi.fn(),
        accumulatePoints: vi.fn(),
        adjust: vi.fn(),
      },
      rewards: {
        create: vi.fn(),
        redeem: vi.fn(),
      },
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('LoyaltyService', () => {
  const defaultLocationId = 'LOC_123';

  describe('getProgram', () => {
    it('should get program by ID', async () => {
      const mockProgram = { id: 'PROG_123', status: 'ACTIVE' };
      const client = createMockClient({
        programs: { get: vi.fn().mockResolvedValue({ program: mockProgram }), list: vi.fn(), calculate: vi.fn() },
      });

      const service = new LoyaltyService(client);
      const result = await service.getProgram('PROG_123');

      expect(result).toEqual(mockProgram);
    });

    it('should list programs if no ID provided', async () => {
      const mockProgram = { id: 'PROG_123' };
      const client = createMockClient({
        programs: { list: vi.fn().mockResolvedValue({ programs: [mockProgram] }), get: vi.fn(), calculate: vi.fn() },
      });

      const service = new LoyaltyService(client);
      const result = await service.getProgram();

      expect(result).toEqual(mockProgram);
    });

    it('should throw if no programs found', async () => {
      const client = createMockClient({
        programs: { list: vi.fn().mockResolvedValue({ programs: [] }), get: vi.fn(), calculate: vi.fn() },
      });

      const service = new LoyaltyService(client);
      await expect(service.getProgram()).rejects.toThrow('No loyalty program found');
    });

    it('should throw if program not found by ID', async () => {
      const client = createMockClient({
        programs: { get: vi.fn().mockResolvedValue({}), list: vi.fn(), calculate: vi.fn() },
      });

      const service = new LoyaltyService(client);
      await expect(service.getProgram('PROG_123')).rejects.toThrow('Loyalty program not found');
    });
  });

  describe('createAccount', () => {
    it('should create account with phone', async () => {
      const mockAccount = { id: 'ACCT_123' };
      const client = createMockClient({
        accounts: {
          create: vi.fn().mockResolvedValue({ loyaltyAccount: mockAccount }),
          get: vi.fn(), search: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      const result = await service.createAccount({ programId: 'PROG_123', phoneNumber: '+15551234567' });

      expect(result).toEqual(mockAccount);
    });

    it('should create account with customerId', async () => {
      const mockAccount = { id: 'ACCT_123' };
      const client = createMockClient({
        accounts: {
          create: vi.fn().mockResolvedValue({ loyaltyAccount: mockAccount }),
          get: vi.fn(), search: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      const result = await service.createAccount({ programId: 'PROG_123', customerId: 'CUST_123' });

      expect(result).toEqual(mockAccount);
    });

    it('should throw for missing programId', async () => {
      const client = createMockClient();
      const service = new LoyaltyService(client);

      await expect(service.createAccount({ programId: '', phoneNumber: '+15551234567' })).rejects.toThrow(SquareValidationError);
    });

    it('should throw for missing both phone and customerId', async () => {
      const client = createMockClient();
      const service = new LoyaltyService(client);

      await expect(service.createAccount({ programId: 'PROG_123' })).rejects.toThrow(SquareValidationError);
    });

    it('should throw if account not created', async () => {
      const client = createMockClient({
        accounts: {
          create: vi.fn().mockResolvedValue({}),
          get: vi.fn(), search: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      await expect(service.createAccount({ programId: 'P', phoneNumber: '+1' })).rejects.toThrow();
    });
  });

  describe('getAccount', () => {
    it('should get account by ID', async () => {
      const mockAccount = { id: 'ACCT_123', balance: 100 };
      const client = createMockClient({
        accounts: {
          get: vi.fn().mockResolvedValue({ loyaltyAccount: mockAccount }),
          create: vi.fn(), search: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      const result = await service.getAccount('ACCT_123');

      expect(result).toEqual(mockAccount);
    });

    it('should throw if not found', async () => {
      const client = createMockClient({
        accounts: {
          get: vi.fn().mockResolvedValue({}),
          create: vi.fn(), search: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      await expect(service.getAccount('ACCT_123')).rejects.toThrow('Loyalty account not found');
    });
  });

  describe('searchAccounts', () => {
    it('should search accounts', async () => {
      const mockAccounts = [{ id: 'ACCT_1' }];
      const client = createMockClient({
        accounts: {
          search: vi.fn().mockResolvedValue({ loyaltyAccounts: mockAccounts, cursor: 'next' }),
          create: vi.fn(), get: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      const result = await service.searchAccounts({ phoneNumber: '+15551234567' });

      expect(result.data).toEqual(mockAccounts);
    });

    it('should search by customerId', async () => {
      const client = createMockClient({
        accounts: {
          search: vi.fn().mockResolvedValue({ loyaltyAccounts: [] }),
          create: vi.fn(), get: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      await service.searchAccounts({ customerId: 'CUST_123' });

      expect(client.loyalty.accounts.search).toHaveBeenCalled();
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        accounts: {
          search: vi.fn().mockRejectedValue({
            statusCode: 500,
            body: { errors: [{ category: 'API_ERROR', code: 'INTERNAL_SERVER_ERROR' }] },
          }),
          create: vi.fn(), get: vi.fn(), accumulatePoints: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      await expect(service.searchAccounts({ programId: 'PROG_123' })).rejects.toThrow();
    });
  });

  describe('accumulatePoints', () => {
    it('should accumulate points by order', async () => {
      const mockEvent = { id: 'EVT_123' };
      const client = createMockClient({
        accounts: {
          accumulatePoints: vi.fn().mockResolvedValue({ event: mockEvent }),
          create: vi.fn(), get: vi.fn(), search: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client, defaultLocationId);
      const result = await service.accumulatePoints('ACCT_123', { orderId: 'ORDER_123' });

      expect(result).toEqual(mockEvent);
    });

    it('should accumulate points manually', async () => {
      const mockEvent = { id: 'EVT_123' };
      const client = createMockClient({
        accounts: {
          accumulatePoints: vi.fn().mockResolvedValue({ event: mockEvent }),
          create: vi.fn(), get: vi.fn(), search: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client, defaultLocationId);
      const result = await service.accumulatePoints('ACCT_123', { points: 50 });

      expect(result).toEqual(mockEvent);
    });

    it('should throw for missing locationId', async () => {
      const client = createMockClient();
      const service = new LoyaltyService(client);

      await expect(service.accumulatePoints('ACCT_123', { points: 50 })).rejects.toThrow(SquareValidationError);
    });

    it('should throw for missing orderId and points', async () => {
      const client = createMockClient();
      const service = new LoyaltyService(client, defaultLocationId);

      await expect(service.accumulatePoints('ACCT_123', {})).rejects.toThrow(SquareValidationError);
    });

    it('should throw if accumulation fails', async () => {
      const client = createMockClient({
        accounts: {
          accumulatePoints: vi.fn().mockResolvedValue({}),
          create: vi.fn(), get: vi.fn(), search: vi.fn(), adjust: vi.fn(),
        },
      });

      const service = new LoyaltyService(client, defaultLocationId);
      await expect(service.accumulatePoints('ACCT_123', { points: 50 })).rejects.toThrow();
    });
  });

  describe('adjustPoints', () => {
    it('should adjust points', async () => {
      const mockEvent = { id: 'EVT_123' };
      const client = createMockClient({
        accounts: {
          adjust: vi.fn().mockResolvedValue({ event: mockEvent }),
          create: vi.fn(), get: vi.fn(), search: vi.fn(), accumulatePoints: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      const result = await service.adjustPoints('ACCT_123', 100, 'Bonus');

      expect(result).toEqual(mockEvent);
    });

    it('should throw if adjustment fails', async () => {
      const client = createMockClient({
        accounts: {
          adjust: vi.fn().mockResolvedValue({}),
          create: vi.fn(), get: vi.fn(), search: vi.fn(), accumulatePoints: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      await expect(service.adjustPoints('ACCT_123', 100)).rejects.toThrow();
    });
  });

  describe('redeemReward', () => {
    it('should redeem reward', async () => {
      const client = createMockClient({
        rewards: {
          create: vi.fn().mockResolvedValue({ reward: { id: 'REWARD_123' } }),
          redeem: vi.fn().mockResolvedValue({ event: { id: 'EVT_123' } }),
        },
      });

      const service = new LoyaltyService(client, defaultLocationId);
      const result = await service.redeemReward('ACCT_123', 'TIER_123');

      expect(result.id).toBe('REWARD_123');
      expect(result.status).toBe('REDEEMED');
    });

    it('should throw for missing locationId', async () => {
      const client = createMockClient();
      const service = new LoyaltyService(client);

      await expect(service.redeemReward('ACCT_123', 'TIER_123')).rejects.toThrow(SquareValidationError);
    });

    it('should throw if reward creation fails', async () => {
      const client = createMockClient({
        rewards: { create: vi.fn().mockResolvedValue({}), redeem: vi.fn() },
      });

      const service = new LoyaltyService(client, defaultLocationId);
      await expect(service.redeemReward('ACCT_123', 'TIER_123')).rejects.toThrow();
    });

    it('should throw if redemption fails', async () => {
      const client = createMockClient({
        rewards: {
          create: vi.fn().mockResolvedValue({ reward: { id: 'R' } }),
          redeem: vi.fn().mockResolvedValue({}),
        },
      });

      const service = new LoyaltyService(client, defaultLocationId);
      await expect(service.redeemReward('ACCT_123', 'TIER_123')).rejects.toThrow();
    });
  });

  describe('calculatePoints', () => {
    it('should calculate points', async () => {
      const client = createMockClient({
        programs: {
          calculate: vi.fn().mockResolvedValue({ points: 100 }),
          get: vi.fn(), list: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      const result = await service.calculatePoints('PROG_123', 'ORDER_123');

      expect(result).toBe(100);
    });

    it('should return 0 if no points', async () => {
      const client = createMockClient({
        programs: {
          calculate: vi.fn().mockResolvedValue({}),
          get: vi.fn(), list: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      const result = await service.calculatePoints('PROG_123', 'ORDER_123');

      expect(result).toBe(0);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        programs: {
          calculate: vi.fn().mockRejectedValue({
            statusCode: 400,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
          }),
          get: vi.fn(), list: vi.fn(),
        },
      });

      const service = new LoyaltyService(client);
      await expect(service.calculatePoints('PROG_123', 'ORDER_123')).rejects.toThrow();
    });
  });
});
