import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { InvoicesService } from '../services/invoices.service.js';
import { SquareValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    orders: { create: vi.fn().mockResolvedValue({ order: { id: 'ORDER_123' } }) },
    invoices: {
      create: vi.fn(),
      get: vi.fn(),
      publish: vi.fn(),
      cancel: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      search: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('InvoicesService', () => {
  const defaultLocationId = 'LOC_123';

  describe('create', () => {
    it('should create an invoice', async () => {
      const mockInvoice = { id: 'INV_123', status: 'DRAFT' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ invoice: mockInvoice }),
      });

      const service = new InvoicesService(client, defaultLocationId);
      const result = await service.create({
        customerId: 'CUST_123',
        lineItems: [{ name: 'Service', quantity: 1, amount: 1000 }],
      });

      expect(result).toEqual(mockInvoice);
    });

    it('should throw SquareValidationError for missing locationId', async () => {
      const client = createMockClient();
      const service = new InvoicesService(client);

      await expect(
        service.create({ customerId: 'CUST_123', lineItems: [{ name: 'X', quantity: 1, amount: 100 }] })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw SquareValidationError for missing customerId', async () => {
      const client = createMockClient();
      const service = new InvoicesService(client, defaultLocationId);

      await expect(
        service.create({ customerId: '', lineItems: [{ name: 'X', quantity: 1, amount: 100 }] })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw SquareValidationError for empty lineItems', async () => {
      const client = createMockClient();
      const service = new InvoicesService(client, defaultLocationId);

      await expect(
        service.create({ customerId: 'CUST_123', lineItems: [] })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw if order creation fails', async () => {
      const client = createMockClient();
      (client.orders.create as ReturnType<typeof vi.fn>).mockResolvedValue({ order: {} });

      const service = new InvoicesService(client, defaultLocationId);
      await expect(
        service.create({ customerId: 'CUST_123', lineItems: [{ name: 'X', quantity: 1, amount: 100 }] })
      ).rejects.toThrow('Failed to create order for invoice');
    });

    it('should throw if invoice not returned', async () => {
      const client = createMockClient({ create: vi.fn().mockResolvedValue({}) });

      const service = new InvoicesService(client, defaultLocationId);
      await expect(
        service.create({ customerId: 'CUST_123', lineItems: [{ name: 'X', quantity: 1, amount: 100 }] })
      ).rejects.toThrow('Invoice was not created');
    });
  });

  describe('get', () => {
    it('should get an invoice', async () => {
      const mockInvoice = { id: 'INV_123' };
      const client = createMockClient({ get: vi.fn().mockResolvedValue({ invoice: mockInvoice }) });

      const service = new InvoicesService(client);
      const result = await service.get('INV_123');

      expect(result).toEqual(mockInvoice);
    });

    it('should throw if not found', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({}) });

      const service = new InvoicesService(client);
      await expect(service.get('INV_123')).rejects.toThrow('Invoice not found');
    });
  });

  describe('publish', () => {
    it('should publish an invoice', async () => {
      const mockInvoice = { id: 'INV_123', status: 'UNPAID' };
      const client = createMockClient({ publish: vi.fn().mockResolvedValue({ invoice: mockInvoice }) });

      const service = new InvoicesService(client);
      const result = await service.publish('INV_123', 0);

      expect(result).toEqual(mockInvoice);
    });

    it('should throw if publish fails', async () => {
      const client = createMockClient({ publish: vi.fn().mockResolvedValue({}) });

      const service = new InvoicesService(client);
      await expect(service.publish('INV_123', 0)).rejects.toThrow('Invoice publish failed');
    });
  });

  describe('cancel', () => {
    it('should cancel an invoice', async () => {
      const mockInvoice = { id: 'INV_123', status: 'CANCELED' };
      const client = createMockClient({ cancel: vi.fn().mockResolvedValue({ invoice: mockInvoice }) });

      const service = new InvoicesService(client);
      const result = await service.cancel('INV_123', 1);

      expect(result).toEqual(mockInvoice);
    });

    it('should throw if cancel fails', async () => {
      const client = createMockClient({ cancel: vi.fn().mockResolvedValue({}) });

      const service = new InvoicesService(client);
      await expect(service.cancel('INV_123', 1)).rejects.toThrow('Invoice cancellation failed');
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      const mockInvoice = { id: 'INV_123', title: 'New Title' };
      const client = createMockClient({ update: vi.fn().mockResolvedValue({ invoice: mockInvoice }) });

      const service = new InvoicesService(client);
      const result = await service.update('INV_123', 0, { title: 'New Title' });

      expect(result).toEqual(mockInvoice);
    });

    it('should clear fields when empty string', async () => {
      const client = createMockClient({ update: vi.fn().mockResolvedValue({ invoice: { id: 'INV_123' } }) });

      const service = new InvoicesService(client);
      await service.update('INV_123', 0, { title: '', description: '' });

      expect(client.invoices.update).toHaveBeenCalledWith(
        expect.objectContaining({ fieldsToClear: ['title', 'description'] })
      );
    });

    it('should throw if update fails', async () => {
      const client = createMockClient({ update: vi.fn().mockResolvedValue({}) });

      const service = new InvoicesService(client);
      await expect(service.update('INV_123', 0, {})).rejects.toThrow('Invoice update failed');
    });
  });

  describe('delete', () => {
    it('should delete an invoice', async () => {
      const client = createMockClient({ delete: vi.fn().mockResolvedValue({}) });

      const service = new InvoicesService(client);
      await service.delete('INV_123', 0);

      expect(client.invoices.delete).toHaveBeenCalledWith({ invoiceId: 'INV_123', version: 0 });
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        delete: vi.fn().mockRejectedValue({
          statusCode: 404,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
        }),
      });

      const service = new InvoicesService(client);
      await expect(service.delete('INV_123', 0)).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('should search invoices', async () => {
      const mockInvoices = [{ id: 'INV_1' }];
      const client = createMockClient({ search: vi.fn().mockResolvedValue({ invoices: mockInvoices, cursor: 'next' }) });

      const service = new InvoicesService(client, defaultLocationId);
      const result = await service.search();

      expect(result.data).toEqual(mockInvoices);
      expect(result.cursor).toBe('next');
    });

    it('should throw error for missing locationId', async () => {
      const client = createMockClient();
      const service = new InvoicesService(client);

      await expect(service.search()).rejects.toThrow();
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        search: vi.fn().mockRejectedValue({
          statusCode: 500,
          body: { errors: [{ category: 'API_ERROR', code: 'INTERNAL_SERVER_ERROR' }] },
        }),
      });

      const service = new InvoicesService(client, defaultLocationId);
      await expect(service.search()).rejects.toThrow();
    });
  });
});
