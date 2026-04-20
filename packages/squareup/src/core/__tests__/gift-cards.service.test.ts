import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import {
  GiftCardsService,
  GiftCardActivitiesService,
} from '../services/gift-cards.service.js';
import { SquareValidationError } from '../errors.js';

function createMockClient(
  giftCardsOverrides: Record<string, unknown> = {},
  activitiesOverrides: Record<string, unknown> = {}
): SquareClient {
  return {
    giftCards: {
      create: vi.fn(),
      get: vi.fn(),
      getFromGan: vi.fn(),
      getFromNonce: vi.fn(),
      list: vi.fn(),
      linkCustomer: vi.fn(),
      unlinkCustomer: vi.fn(),
      activities: {
        create: vi.fn(),
        list: vi.fn(),
        ...activitiesOverrides,
      },
      ...giftCardsOverrides,
    },
  } as unknown as SquareClient;
}

const defaultLocation = 'LOC_DEFAULT';

describe('GiftCardsService', () => {
  describe('create', () => {
    it('should issue a digital gift card with default location', async () => {
      const mock = { id: 'gftc:abc', type: 'DIGITAL', state: 'PENDING' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ giftCard: mock }),
      });

      const result = await new GiftCardsService(client, defaultLocation).create({
        type: 'DIGITAL',
      });

      expect(result).toEqual(mock);
      expect(client.giftCards.create).toHaveBeenCalledWith(
        expect.objectContaining({
          locationId: defaultLocation,
          giftCard: { type: 'DIGITAL', gan: undefined, ganSource: undefined },
          idempotencyKey: expect.any(String),
        })
      );
    });

    it('should pass custom GAN + ganSource for OTHER source', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ giftCard: { id: 'X' } }),
      });

      await new GiftCardsService(client, defaultLocation).create({
        type: 'DIGITAL',
        gan: 'CUSTOM12345',
        ganSource: 'OTHER',
        idempotencyKey: 'key-1',
      });

      expect(client.giftCards.create).toHaveBeenCalledWith(
        expect.objectContaining({
          idempotencyKey: 'key-1',
          giftCard: { type: 'DIGITAL', gan: 'CUSTOM12345', ganSource: 'OTHER' },
        })
      );
    });

    it('should override default location with explicit option', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ giftCard: { id: 'X' } }),
      });

      await new GiftCardsService(client, defaultLocation).create({
        type: 'PHYSICAL',
        locationId: 'OTHER_LOC',
        gan: 'PHYSCARD123',
      });

      expect(client.giftCards.create).toHaveBeenCalledWith(
        expect.objectContaining({ locationId: 'OTHER_LOC' })
      );
    });

    it('should require type', async () => {
      const service = new GiftCardsService(createMockClient(), defaultLocation);
      await expect(
        service.create({ type: '' as unknown as 'DIGITAL' })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should require locationId when no default set', async () => {
      const service = new GiftCardsService(createMockClient());
      await expect(service.create({ type: 'DIGITAL' })).rejects.toThrow(
        SquareValidationError
      );
    });

    it('should throw when response is missing giftCard', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({}),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).create({ type: 'DIGITAL' })
      ).rejects.toThrow();
    });

    it('should wrap SDK errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue(new Error('boom')),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).create({ type: 'DIGITAL' })
      ).rejects.toThrow();
    });
  });

  describe('get', () => {
    it('should fetch by id', async () => {
      const mock = { id: 'gftc:abc' };
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({ giftCard: mock }),
      });

      const result = await new GiftCardsService(client, defaultLocation).get('gftc:abc');

      expect(result).toEqual(mock);
      expect(client.giftCards.get).toHaveBeenCalledWith({ id: 'gftc:abc' });
    });

    it('should throw when not found', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({}) });
      await expect(
        new GiftCardsService(client, defaultLocation).get('X')
      ).rejects.toThrow();
    });

    it('should wrap errors', async () => {
      const client = createMockClient({
        get: vi.fn().mockRejectedValue(new Error('boom')),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).get('X')
      ).rejects.toThrow();
    });
  });

  describe('getFromGan', () => {
    it('should fetch by GAN', async () => {
      const mock = { id: 'X', gan: '7783320001112222' };
      const client = createMockClient({
        getFromGan: vi.fn().mockResolvedValue({ giftCard: mock }),
      });

      const result = await new GiftCardsService(client, defaultLocation).getFromGan(
        '7783320001112222'
      );
      expect(result).toEqual(mock);
      expect(client.giftCards.getFromGan).toHaveBeenCalledWith({
        gan: '7783320001112222',
      });
    });

    it('should throw when not found', async () => {
      const client = createMockClient({
        getFromGan: vi.fn().mockResolvedValue({}),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).getFromGan('X')
      ).rejects.toThrow();
    });

    it('should wrap errors', async () => {
      const client = createMockClient({
        getFromGan: vi.fn().mockRejectedValue(new Error('boom')),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).getFromGan('X')
      ).rejects.toThrow();
    });
  });

  describe('getFromNonce', () => {
    it('should fetch by nonce', async () => {
      const mock = { id: 'X' };
      const client = createMockClient({
        getFromNonce: vi.fn().mockResolvedValue({ giftCard: mock }),
      });

      const result = await new GiftCardsService(client, defaultLocation).getFromNonce(
        'cnon:nonce-123'
      );
      expect(result).toEqual(mock);
      expect(client.giftCards.getFromNonce).toHaveBeenCalledWith({
        nonce: 'cnon:nonce-123',
      });
    });

    it('should throw when not found', async () => {
      const client = createMockClient({
        getFromNonce: vi.fn().mockResolvedValue({}),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).getFromNonce('X')
      ).rejects.toThrow();
    });

    it('should wrap errors', async () => {
      const client = createMockClient({
        getFromNonce: vi.fn().mockRejectedValue(new Error('boom')),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).getFromNonce('X')
      ).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list with filters', async () => {
      const mock = [{ id: '1' }, { id: '2' }];
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: { giftCards: mock, cursor: 'next' },
        }),
      });

      const result = await new GiftCardsService(client, defaultLocation).list({
        type: 'DIGITAL',
        state: 'ACTIVE',
        customerId: 'CUST_1',
        limit: 10,
      });

      expect(result).toEqual({ giftCards: mock, cursor: 'next' });
      expect(client.giftCards.list).toHaveBeenCalledWith({
        type: 'DIGITAL',
        state: 'ACTIVE',
        customerId: 'CUST_1',
        limit: 10,
        cursor: undefined,
      });
    });

    it('should default to empty result on bare response', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ response: {} }),
      });

      const result = await new GiftCardsService(client, defaultLocation).list();
      expect(result).toEqual({ giftCards: [], cursor: undefined });
    });

    it('should wrap errors', async () => {
      const client = createMockClient({
        list: vi.fn().mockRejectedValue(new Error('boom')),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).list()
      ).rejects.toThrow();
    });
  });

  describe('search (alias for list)', () => {
    it('should return data + cursor shape', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: { giftCards: [{ id: '1' }], cursor: 'c' },
        }),
      });

      const result = await new GiftCardsService(client, defaultLocation).search({
        type: 'DIGITAL',
      });
      expect(result).toEqual({ data: [{ id: '1' }], cursor: 'c' });
    });
  });

  describe('linkCustomer', () => {
    it('should link and return updated card', async () => {
      const mock = { id: 'X', customerIds: ['CUST_1'] };
      const client = createMockClient({
        linkCustomer: vi.fn().mockResolvedValue({ giftCard: mock }),
      });

      const result = await new GiftCardsService(client, defaultLocation).linkCustomer(
        'X',
        'CUST_1'
      );
      expect(result).toEqual(mock);
      expect(client.giftCards.linkCustomer).toHaveBeenCalledWith({
        giftCardId: 'X',
        customerId: 'CUST_1',
      });
    });

    it('should require giftCardId', async () => {
      const service = new GiftCardsService(createMockClient(), defaultLocation);
      await expect(service.linkCustomer('', 'CUST_1')).rejects.toThrow(
        SquareValidationError
      );
    });

    it('should require customerId', async () => {
      const service = new GiftCardsService(createMockClient(), defaultLocation);
      await expect(service.linkCustomer('X', '')).rejects.toThrow(
        SquareValidationError
      );
    });

    it('should throw when response missing card', async () => {
      const client = createMockClient({
        linkCustomer: vi.fn().mockResolvedValue({}),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).linkCustomer('X', 'CUST_1')
      ).rejects.toThrow();
    });

    it('should wrap errors', async () => {
      const client = createMockClient({
        linkCustomer: vi.fn().mockRejectedValue(new Error('boom')),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).linkCustomer('X', 'CUST_1')
      ).rejects.toThrow();
    });
  });

  describe('unlinkCustomer', () => {
    it('should unlink and return updated card', async () => {
      const mock = { id: 'X', customerIds: [] };
      const client = createMockClient({
        unlinkCustomer: vi.fn().mockResolvedValue({ giftCard: mock }),
      });

      const result = await new GiftCardsService(client, defaultLocation).unlinkCustomer(
        'X',
        'CUST_1'
      );
      expect(result).toEqual(mock);
      expect(client.giftCards.unlinkCustomer).toHaveBeenCalledWith({
        giftCardId: 'X',
        customerId: 'CUST_1',
      });
    });

    it('should require giftCardId', async () => {
      const service = new GiftCardsService(createMockClient(), defaultLocation);
      await expect(service.unlinkCustomer('', 'CUST_1')).rejects.toThrow(
        SquareValidationError
      );
    });

    it('should require customerId', async () => {
      const service = new GiftCardsService(createMockClient(), defaultLocation);
      await expect(service.unlinkCustomer('X', '')).rejects.toThrow(
        SquareValidationError
      );
    });

    it('should throw when response missing card', async () => {
      const client = createMockClient({
        unlinkCustomer: vi.fn().mockResolvedValue({}),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).unlinkCustomer('X', 'CUST_1')
      ).rejects.toThrow();
    });

    it('should wrap errors', async () => {
      const client = createMockClient({
        unlinkCustomer: vi.fn().mockRejectedValue(new Error('boom')),
      });
      await expect(
        new GiftCardsService(client, defaultLocation).unlinkCustomer('X', 'CUST_1')
      ).rejects.toThrow();
    });
  });

  describe('convenience helpers', () => {
    it('activate should call activities.create with ACTIVATE details', async () => {
      const mockActivity = { id: 'A1', type: 'ACTIVATE' };
      const activitiesCreate = vi.fn().mockResolvedValue({ giftCardActivity: mockActivity });
      const client = createMockClient({}, { create: activitiesCreate });

      const result = await new GiftCardsService(client, defaultLocation).activate(
        'gftc:1',
        2500
      );

      expect(result).toEqual(mockActivity);
      expect(activitiesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            type: 'ACTIVATE',
            giftCardId: 'gftc:1',
            locationId: defaultLocation,
            activateActivityDetails: expect.objectContaining({
              amountMoney: { amount: BigInt(2500), currency: 'USD' },
            }),
          }),
        })
      );
    });

    it('load should call activities.create with LOAD details', async () => {
      const activitiesCreate = vi.fn().mockResolvedValue({
        giftCardActivity: { id: 'A2', type: 'LOAD' },
      });
      const client = createMockClient({}, { create: activitiesCreate });

      await new GiftCardsService(client, defaultLocation).load('gftc:1', 1000, {
        currency: 'EUR',
        referenceId: 'topup-1',
      });

      expect(activitiesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            type: 'LOAD',
            loadActivityDetails: expect.objectContaining({
              amountMoney: { amount: BigInt(1000), currency: 'EUR' },
              referenceId: 'topup-1',
            }),
          }),
        })
      );
    });

    it('load should default currency to USD when omitted', async () => {
      const activitiesCreate = vi.fn().mockResolvedValue({
        giftCardActivity: { id: 'A2' },
      });
      const client = createMockClient({}, { create: activitiesCreate });

      await new GiftCardsService(client, defaultLocation).load('gftc:1', 500);

      const call = activitiesCreate.mock.calls[0][0];
      expect(call.giftCardActivity.loadActivityDetails.amountMoney).toEqual({
        amount: BigInt(500),
        currency: 'USD',
      });
    });

    it('redeem should call activities.create with REDEEM details', async () => {
      const activitiesCreate = vi.fn().mockResolvedValue({
        giftCardActivity: { id: 'A3', type: 'REDEEM' },
      });
      const client = createMockClient({}, { create: activitiesCreate });

      await new GiftCardsService(client, defaultLocation).redeem('gftc:1', 500, {
        paymentId: 'PAY_1',
      });

      expect(activitiesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            type: 'REDEEM',
            redeemActivityDetails: expect.objectContaining({
              amountMoney: { amount: BigInt(500), currency: 'USD' },
              paymentId: 'PAY_1',
            }),
          }),
        })
      );
    });

    it('deactivate should call activities.create with DEACTIVATE details', async () => {
      const activitiesCreate = vi.fn().mockResolvedValue({
        giftCardActivity: { id: 'A4', type: 'DEACTIVATE' },
      });
      const client = createMockClient({}, { create: activitiesCreate });

      await new GiftCardsService(client, defaultLocation).deactivate(
        'gftc:1',
        'SUSPICIOUS_ACTIVITY'
      );

      expect(activitiesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            type: 'DEACTIVATE',
            deactivateActivityDetails: { reason: 'SUSPICIOUS_ACTIVITY' },
          }),
        })
      );
    });

    it('deactivate should default reason to UNKNOWN_REASON', async () => {
      const activitiesCreate = vi.fn().mockResolvedValue({
        giftCardActivity: { id: 'A4' },
      });
      const client = createMockClient({}, { create: activitiesCreate });

      await new GiftCardsService(client, defaultLocation).deactivate('gftc:1');

      expect(activitiesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            deactivateActivityDetails: { reason: 'UNKNOWN_REASON' },
          }),
        })
      );
    });
  });
});

describe('GiftCardActivitiesService', () => {
  describe('create', () => {
    it('should create an ACTIVATE activity', async () => {
      const mock = { id: 'A1', type: 'ACTIVATE' };
      const create = vi.fn().mockResolvedValue({ giftCardActivity: mock });
      const client = createMockClient({}, { create });

      const result = await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'ACTIVATE',
        giftCardId: 'gftc:1',
        activateActivityDetails: {
          amountMoney: { amount: 2500, currency: 'USD' },
          orderId: 'O1',
          lineItemUid: 'L1',
        },
      });

      expect(result).toEqual(mock);
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            type: 'ACTIVATE',
            giftCardId: 'gftc:1',
            locationId: defaultLocation,
            activateActivityDetails: expect.objectContaining({
              amountMoney: { amount: BigInt(2500), currency: 'USD' },
              orderId: 'O1',
            }),
          }),
        })
      );
    });

    it('should accept giftCardGan instead of giftCardId', async () => {
      const create = vi.fn().mockResolvedValue({ giftCardActivity: { id: 'A' } });
      const client = createMockClient({}, { create });

      await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'LOAD',
        giftCardGan: '7783000011112222',
        loadActivityDetails: {
          amountMoney: { amount: 100, currency: 'USD' },
        },
      });

      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            giftCardGan: '7783000011112222',
            giftCardId: undefined,
          }),
        })
      );
    });

    it('should coerce bigint amounts on REDEEM', async () => {
      const create = vi.fn().mockResolvedValue({ giftCardActivity: { id: 'A' } });
      const client = createMockClient({}, { create });

      await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'REDEEM',
        giftCardId: 'gftc:1',
        redeemActivityDetails: {
          amountMoney: { amount: BigInt(750), currency: 'USD' },
        },
      });

      const call = create.mock.calls[0][0];
      expect(call.giftCardActivity.redeemActivityDetails.amountMoney.amount).toBe(
        BigInt(750)
      );
    });

    it('should require type', async () => {
      const service = new GiftCardActivitiesService(createMockClient(), defaultLocation);
      await expect(
        service.create({
          type: '' as unknown as 'ACTIVATE',
          giftCardId: 'X',
        })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should require giftCardId or giftCardGan', async () => {
      const service = new GiftCardActivitiesService(createMockClient(), defaultLocation);
      await expect(
        service.create({ type: 'ACTIVATE' })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should require locationId when no default set', async () => {
      const service = new GiftCardActivitiesService(createMockClient());
      await expect(
        service.create({ type: 'ACTIVATE', giftCardId: 'X' })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw when response missing activity', async () => {
      const create = vi.fn().mockResolvedValue({});
      const client = createMockClient({}, { create });
      await expect(
        new GiftCardActivitiesService(client, defaultLocation).create({
          type: 'ACTIVATE',
          giftCardId: 'X',
        })
      ).rejects.toThrow();
    });

    it('should wrap errors', async () => {
      const create = vi.fn().mockRejectedValue(new Error('boom'));
      const client = createMockClient({}, { create });
      await expect(
        new GiftCardActivitiesService(client, defaultLocation).create({
          type: 'ACTIVATE',
          giftCardId: 'X',
        })
      ).rejects.toThrow();
    });

    it('should pass adjustIncrement details', async () => {
      const create = vi.fn().mockResolvedValue({ giftCardActivity: { id: 'A' } });
      const client = createMockClient({}, { create });

      await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'ADJUST_INCREMENT',
        giftCardId: 'gftc:1',
        adjustIncrementActivityDetails: {
          amountMoney: { amount: 100, currency: 'USD' },
          reason: 'COMPLIMENTARY',
        },
      });

      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            adjustIncrementActivityDetails: {
              amountMoney: { amount: BigInt(100), currency: 'USD' },
              reason: 'COMPLIMENTARY',
            },
          }),
        })
      );
    });

    it('should pass adjustDecrement details', async () => {
      const create = vi.fn().mockResolvedValue({ giftCardActivity: { id: 'A' } });
      const client = createMockClient({}, { create });

      await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'ADJUST_DECREMENT',
        giftCardId: 'gftc:1',
        adjustDecrementActivityDetails: {
          amountMoney: { amount: 50, currency: 'USD' },
          reason: 'BALANCE_REMAINING',
        },
      });

      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardActivity: expect.objectContaining({
            adjustDecrementActivityDetails: {
              amountMoney: { amount: BigInt(50), currency: 'USD' },
              reason: 'BALANCE_REMAINING',
            },
          }),
        })
      );
    });

    it('should handle activity details without amountMoney (undefined money)', async () => {
      const create = vi.fn().mockResolvedValue({ giftCardActivity: { id: 'A' } });
      const client = createMockClient({}, { create });

      await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'ACTIVATE',
        giftCardId: 'gftc:1',
        // amountMoney omitted — Square populates from the linked Order line item
        activateActivityDetails: { orderId: 'O1', lineItemUid: 'L1' },
      });

      const call = create.mock.calls[0][0];
      expect(call.giftCardActivity.activateActivityDetails.amountMoney).toBeUndefined();
      expect(call.giftCardActivity.activateActivityDetails.orderId).toBe('O1');
    });

    it('should handle amountMoney with currency but no amount', async () => {
      const create = vi.fn().mockResolvedValue({ giftCardActivity: { id: 'A' } });
      const client = createMockClient({}, { create });

      await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'LOAD',
        giftCardId: 'gftc:1',
        loadActivityDetails: {
          amountMoney: { currency: 'USD' } as { amount: bigint; currency: string },
        },
      });

      const call = create.mock.calls[0][0];
      expect(call.giftCardActivity.loadActivityDetails.amountMoney).toEqual({
        amount: undefined,
        currency: 'USD',
      });
    });

    it('should pass clearBalance details', async () => {
      const create = vi.fn().mockResolvedValue({ giftCardActivity: { id: 'A' } });
      const client = createMockClient({}, { create });

      await new GiftCardActivitiesService(client, defaultLocation).create({
        type: 'CLEAR_BALANCE',
        giftCardId: 'gftc:1',
        clearBalanceActivityDetails: { reason: 'CHARGEBACK_DEACTIVATE' },
      });

      const call = create.mock.calls[0][0];
      expect(call.giftCardActivity.clearBalanceActivityDetails).toEqual({
        reason: 'CHARGEBACK_DEACTIVATE',
      });
    });
  });

  describe('list', () => {
    it('should list with filters', async () => {
      const mock = [{ id: 'A1' }, { id: 'A2' }];
      const list = vi.fn().mockResolvedValue({
        response: { giftCardActivities: mock, cursor: 'next' },
      });
      const client = createMockClient({}, { list });

      const result = await new GiftCardActivitiesService(client, defaultLocation).list({
        giftCardId: 'gftc:1',
        type: 'LOAD',
        sortOrder: 'ASC',
        limit: 25,
      });

      expect(result).toEqual({ activities: mock, cursor: 'next' });
      expect(list).toHaveBeenCalledWith(
        expect.objectContaining({
          giftCardId: 'gftc:1',
          type: 'LOAD',
          sortOrder: 'ASC',
          limit: 25,
        })
      );
    });

    it('should default to empty', async () => {
      const list = vi.fn().mockResolvedValue({ response: {} });
      const client = createMockClient({}, { list });

      const result = await new GiftCardActivitiesService(client, defaultLocation).list();
      expect(result).toEqual({ activities: [], cursor: undefined });
    });

    it('should wrap errors', async () => {
      const list = vi.fn().mockRejectedValue(new Error('boom'));
      const client = createMockClient({}, { list });
      await expect(
        new GiftCardActivitiesService(client, defaultLocation).list()
      ).rejects.toThrow();
    });
  });
});
