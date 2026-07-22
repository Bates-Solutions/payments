import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { InvoicesService } from '../services/invoices.service.js';
import { StripeValidationError } from '../errors.js';

function createMockClient(
  invoiceOverrides: Record<string, unknown> = {},
  invoiceItemOverrides: Record<string, unknown> = {}
): Stripe {
  return {
    invoices: {
      create: vi.fn(),
      retrieve: vi.fn(),
      list: vi.fn(),
      finalizeInvoice: vi.fn(),
      pay: vi.fn(),
      voidInvoice: vi.fn(),
      sendInvoice: vi.fn(),
      ...invoiceOverrides,
    },
    invoiceItems: {
      create: vi.fn(),
      ...invoiceItemOverrides,
    },
  } as unknown as Stripe;
}

describe('InvoicesService', () => {
  describe('create', () => {
    it('creates a draft invoice with an idempotency key', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 'in_1', status: 'draft' }),
      });

      const service = new InvoicesService(client);
      const result = await service.create({ customerId: 'cus_1', description: 'July' });

      expect(result.id).toBe('in_1');
      expect(client.invoices.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_1',
          auto_advance: false,
          collection_method: 'charge_automatically',
          description: 'July',
        }),
        expect.objectContaining({ idempotencyKey: expect.any(String) })
      );
    });

    it('throws when customerId is missing', async () => {
      const service = new InvoicesService(createMockClient());
      await expect(service.create({ customerId: '' })).rejects.toThrow(StripeValidationError);
    });

    it('rethrows API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(new InvoicesService(client).create({ customerId: 'cus_1' })).rejects.toThrow();
    });
  });

  describe('addItem', () => {
    it('adds an ad-hoc amount item to a specific invoice', async () => {
      const client = createMockClient(
        {},
        { create: vi.fn().mockResolvedValue({ id: 'ii_1' }) }
      );

      const service = new InvoicesService(client);
      const result = await service.addItem({
        customerId: 'cus_1',
        amount: 4900,
        currency: 'usd',
        invoiceId: 'in_1',
      });

      expect(result.id).toBe('ii_1');
      expect(client.invoiceItems.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_1',
          amount: 4900,
          currency: 'usd',
          invoice: 'in_1',
        }),
        expect.objectContaining({ idempotencyKey: expect.any(String) })
      );
    });

    it('adds a price-based item', async () => {
      const client = createMockClient({}, { create: vi.fn().mockResolvedValue({ id: 'ii_2' }) });
      await new InvoicesService(client).addItem({
        customerId: 'cus_1',
        priceId: 'price_1',
        quantity: 2,
      });
      expect(client.invoiceItems.create).toHaveBeenCalledWith(
        expect.objectContaining({ customer: 'cus_1', pricing: { price: 'price_1' }, quantity: 2 }),
        expect.anything()
      );
    });

    it('throws when neither amount nor priceId is provided', async () => {
      const service = new InvoicesService(createMockClient());
      await expect(service.addItem({ customerId: 'cus_1' })).rejects.toThrow(StripeValidationError);
    });

    it('throws when amount is provided without a currency', async () => {
      const service = new InvoicesService(createMockClient());
      await expect(
        service.addItem({ customerId: 'cus_1', amount: 4900 })
      ).rejects.toThrow(StripeValidationError);
    });

    it('throws when customerId is missing', async () => {
      const service = new InvoicesService(createMockClient());
      await expect(
        service.addItem({ customerId: '', amount: 4900, currency: 'usd' })
      ).rejects.toThrow(StripeValidationError);
    });
  });

  describe('get / list', () => {
    it('retrieves an invoice', async () => {
      const client = createMockClient({ retrieve: vi.fn().mockResolvedValue({ id: 'in_1' }) });
      const result = await new InvoicesService(client).get('in_1');
      expect(result.id).toBe('in_1');
      expect(client.invoices.retrieve).toHaveBeenCalledWith('in_1');
    });

    it('lists invoices and sets nextCursor only when has_more', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ data: [{ id: 'in_1' }], has_more: true }),
      });
      const result = await new InvoicesService(client).list({ customerId: 'cus_1', status: 'open' });
      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBe('in_1');
      expect(client.invoices.list).toHaveBeenCalledWith(
        expect.objectContaining({ customer: 'cus_1', status: 'open' })
      );
    });

    it('leaves nextCursor undefined when has_more is false', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ data: [{ id: 'in_1' }], has_more: false }),
      });
      const result = await new InvoicesService(client).list();
      expect(result.nextCursor).toBeUndefined();
    });
  });

  describe('lifecycle actions', () => {
    it('finalizes, pays, voids, and sends by ID', async () => {
      const client = createMockClient({
        finalizeInvoice: vi.fn().mockResolvedValue({ id: 'in_1', status: 'open' }),
        pay: vi.fn().mockResolvedValue({ id: 'in_1', status: 'paid' }),
        voidInvoice: vi.fn().mockResolvedValue({ id: 'in_1', status: 'void' }),
        sendInvoice: vi.fn().mockResolvedValue({ id: 'in_1', status: 'open' }),
      });
      const service = new InvoicesService(client);

      expect((await service.finalize('in_1')).status).toBe('open');
      expect((await service.pay('in_1')).status).toBe('paid');
      expect((await service.voidInvoice('in_1')).status).toBe('void');
      await service.send('in_1');

      expect(client.invoices.finalizeInvoice).toHaveBeenCalledWith('in_1');
      expect(client.invoices.pay).toHaveBeenCalledWith('in_1');
      expect(client.invoices.voidInvoice).toHaveBeenCalledWith('in_1');
      expect(client.invoices.sendInvoice).toHaveBeenCalledWith('in_1');
    });

    it('rethrows API errors from lifecycle actions', async () => {
      const err = { type: 'invalid_request_error', statusCode: 400 };
      await expect(
        new InvoicesService(createMockClient({ pay: vi.fn().mockRejectedValue(err) })).pay('in_x')
      ).rejects.toThrow();
    });
  });
});
