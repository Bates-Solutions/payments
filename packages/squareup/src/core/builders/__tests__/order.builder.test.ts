import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { OrderBuilder } from '../order.builder.js';
import { SquareValidationError, SquareApiError } from '../../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    orders: {
      create: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('OrderBuilder', () => {
  const locationId = 'LOC_123';

  describe('addItem', () => {
    it('should add item with name and amount', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.addItem({ name: 'Coffee', amount: 350 });
      const preview = builder.preview();

      expect(preview.lineItems).toHaveLength(1);
      expect(preview.lineItems[0]).toEqual({
        quantity: '1',
        name: 'Coffee',
        basePriceMoney: { amount: BigInt(350), currency: 'USD' },
      });
    });

    it('should add item with catalogObjectId', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.addItem({ catalogObjectId: 'CAT_123' });
      const preview = builder.preview();

      expect(preview.lineItems[0]).toEqual({
        quantity: '1',
        catalogObjectId: 'CAT_123',
      });
    });

    it('should add item with custom quantity', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.addItem({ catalogObjectId: 'CAT_123', quantity: 3 });
      const preview = builder.preview();

      expect(preview.lineItems[0].quantity).toBe('3');
    });

    it('should add item with note', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.addItem({ name: 'Coffee', amount: 350, note: 'Extra hot' });
      const preview = builder.preview();

      expect(preview.lineItems[0].note).toBe('Extra hot');
    });

    it('should throw for item without catalogObjectId or name+amount', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      expect(() => builder.addItem({ name: 'Coffee' })).toThrow(SquareValidationError);
    });

    it('should throw for item with only amount (no name)', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      // @ts-expect-error Testing invalid input
      expect(() => builder.addItem({ amount: 350 })).toThrow(SquareValidationError);
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.addItem({ name: 'Coffee', amount: 350 });
      expect(result).toBe(builder);
    });
  });

  describe('addItems', () => {
    it('should add multiple items', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.addItems([
        { name: 'Coffee', amount: 350 },
        { catalogObjectId: 'CAT_123' },
      ]);
      const preview = builder.preview();

      expect(preview.lineItems).toHaveLength(2);
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.addItems([{ name: 'Coffee', amount: 350 }]);
      expect(result).toBe(builder);
    });
  });

  describe('withCurrency', () => {
    it('should set currency for subsequent items', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.withCurrency('EUR').addItem({ name: 'Coffee', amount: 350 });
      const preview = builder.preview();

      expect(preview.currency).toBe('EUR');
      expect(preview.lineItems[0].basePriceMoney?.currency).toBe('EUR');
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.withCurrency('GBP');
      expect(result).toBe(builder);
    });
  });

  describe('withTip', () => {
    it('should set tip amount', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.withTip(500);
      const preview = builder.preview();

      expect(preview.tipAmount).toBe(BigInt(500));
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.withTip(100);
      expect(result).toBe(builder);
    });
  });

  describe('withCustomer', () => {
    it('should set customer ID', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.withCustomer('CUST_123');
      const preview = builder.preview();

      expect(preview.customerId).toBe('CUST_123');
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.withCustomer('CUST_123');
      expect(result).toBe(builder);
    });
  });

  describe('withReference', () => {
    it('should set reference ID', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.withReference('REF_123');
      const preview = builder.preview();

      expect(preview.referenceId).toBe('REF_123');
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.withReference('REF_123');
      expect(result).toBe(builder);
    });
  });

  describe('withNote', () => {
    it('should be chainable (note is no-op for API compatibility)', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.withNote('Special instructions');
      expect(result).toBe(builder);
    });
  });

  describe('preview', () => {
    it('should return order configuration without creating', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder
        .withCurrency('EUR')
        .addItem({ name: 'Coffee', amount: 350 })
        .withCustomer('CUST_123')
        .withReference('REF_123')
        .withTip(100);

      const preview = builder.preview();

      expect(preview).toEqual({
        locationId: 'LOC_123',
        lineItems: [
          {
            quantity: '1',
            name: 'Coffee',
            basePriceMoney: { amount: BigInt(350), currency: 'EUR' },
          },
        ],
        customerId: 'CUST_123',
        referenceId: 'REF_123',
        tipAmount: BigInt(100),
        currency: 'EUR',
      });

      expect(client.orders.create).not.toHaveBeenCalled();
    });

    it('should return a copy of lineItems', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder.addItem({ name: 'Coffee', amount: 350 });
      const preview1 = builder.preview();
      const preview2 = builder.preview();

      expect(preview1.lineItems).not.toBe(preview2.lineItems);
    });
  });

  describe('reset', () => {
    it('should clear all builder state', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      builder
        .addItem({ name: 'Coffee', amount: 350 })
        .withCustomer('CUST_123')
        .withReference('REF_123')
        .withTip(100);

      builder.reset();
      const preview = builder.preview();

      expect(preview.lineItems).toHaveLength(0);
      expect(preview.customerId).toBeUndefined();
      expect(preview.referenceId).toBeUndefined();
      expect(preview.tipAmount).toBeUndefined();
    });

    it('should be chainable', () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      const result = builder.reset();
      expect(result).toBe(builder);
    });
  });

  describe('build', () => {
    it('should create order via API', async () => {
      const mockOrder = { id: 'ORDER_123', state: 'OPEN' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ order: mockOrder }),
      });

      const builder = new OrderBuilder(client, locationId);
      const result = await builder.addItem({ name: 'Coffee', amount: 350 }).build();

      expect(result).toEqual(mockOrder);
      expect(client.orders.create).toHaveBeenCalledWith(
        expect.objectContaining({
          order: expect.objectContaining({
            locationId,
            lineItems: expect.any(Array),
          }),
          idempotencyKey: expect.any(String),
        })
      );
    });

    it('should pass customerId and referenceId', async () => {
      const mockOrder = { id: 'ORDER_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ order: mockOrder }),
      });

      const builder = new OrderBuilder(client, locationId);
      await builder
        .addItem({ name: 'Coffee', amount: 350 })
        .withCustomer('CUST_123')
        .withReference('REF_123')
        .build();

      expect(client.orders.create).toHaveBeenCalledWith(
        expect.objectContaining({
          order: expect.objectContaining({
            customerId: 'CUST_123',
            referenceId: 'REF_123',
          }),
        })
      );
    });

    it('should throw validation error for no line items', async () => {
      const client = createMockClient();
      const builder = new OrderBuilder(client, locationId);

      await expect(builder.build()).rejects.toThrow(SquareValidationError);
      await expect(builder.build()).rejects.toThrow('Order must have at least one line item');
    });

    it('should throw if order not returned', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({}),
      });

      const builder = new OrderBuilder(client, locationId);
      await expect(
        builder.addItem({ name: 'Coffee', amount: 350 }).build()
      ).rejects.toThrow('Order was not created');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const builder = new OrderBuilder(client, locationId);
      await expect(
        builder.addItem({ name: 'Coffee', amount: 350 }).build()
      ).rejects.toThrow(SquareApiError);
    });
  });

  describe('method chaining', () => {
    it('should support full fluent API chain', async () => {
      const mockOrder = { id: 'ORDER_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ order: mockOrder }),
      });

      const builder = new OrderBuilder(client, locationId);
      const result = await builder
        .withCurrency('EUR')
        .addItem({ name: 'Latte', amount: 450 })
        .addItem({ catalogObjectId: 'ITEM_123', quantity: 2 })
        .withTip(100)
        .withCustomer('CUST_123')
        .withReference('REF_123')
        .withNote('Test order')
        .build();

      expect(result).toEqual(mockOrder);
    });
  });
});
