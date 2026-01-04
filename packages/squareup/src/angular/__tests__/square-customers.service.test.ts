import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SquareCustomersService } from '../services/square-customers.service.js';
import { firstValueFrom } from 'rxjs';

describe('SquareCustomersService', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function createService(): SquareCustomersService {
    TestBed.configureTestingModule({
      providers: [SquareCustomersService],
    });
    return TestBed.inject(SquareCustomersService);
  }

  describe('initialization', () => {
    it('should create service', () => {
      const service = createService();
      expect(service).toBeTruthy();
    });

    it('should expose loading$ observable', () => {
      const service = createService();
      expect(service.loading$).toBeDefined();
    });

    it('should expose error$ observable', () => {
      const service = createService();
      expect(service.error$).toBeDefined();
    });
  });

  describe('create', () => {
    it('should post customer to API', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'John' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ customer: mockCustomer }),
      });

      const service = createService();

      const result = await firstValueFrom(
        service.create({
          givenName: 'John',
          familyName: 'Doe',
          emailAddress: 'john@example.com',
        })
      );

      expect(fetch).toHaveBeenCalledWith(
        '/api/customers',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual({ customer: mockCustomer });
    });

    it('should include idempotencyKey', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.create({ givenName: 'John' }));

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.idempotencyKey).toBeDefined();
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.create({ givenName: 'John' }, '/custom/customers'));

      expect(fetch).toHaveBeenCalledWith('/custom/customers', expect.anything());
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid email' }),
      });

      const service = createService();

      await expect(
        firstValueFrom(service.create({ emailAddress: 'invalid' }))
      ).rejects.toThrow('Invalid email');
    });

    it('should set loading state', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();

      const loadingStates: boolean[] = [];
      service.loading$.subscribe((l) => loadingStates.push(l));

      await firstValueFrom(service.create({ givenName: 'John' }));

      expect(loadingStates).toContain(true);
      expect(loadingStates[loadingStates.length - 1]).toBe(false);
    });
  });

  describe('retrieve', () => {
    it('should get customer by ID', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'John' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ customer: mockCustomer }),
      });

      const service = createService();

      const result = await firstValueFrom(service.retrieve('CUST_123'));

      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/CUST_123',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({ customer: mockCustomer });
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.retrieve('CUST_123', '/custom/customers'));

      expect(fetch).toHaveBeenCalledWith('/custom/customers/CUST_123', expect.anything());
    });

    it('should handle not found errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Customer not found' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.retrieve('INVALID_ID'))).rejects.toThrow(
        'Customer not found'
      );
    });
  });

  describe('update', () => {
    it('should update customer by ID', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'Jane' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ customer: mockCustomer }),
      });

      const service = createService();

      const result = await firstValueFrom(
        service.update('CUST_123', { givenName: 'Jane' })
      );

      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/CUST_123',
        expect.objectContaining({ method: 'PUT' })
      );
      expect(result).toEqual({ customer: mockCustomer });
    });

    it('should send update data in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.update('CUST_123', { givenName: 'Jane', note: 'VIP' }));

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.givenName).toBe('Jane');
      expect(body.note).toBe('VIP');
    });
  });

  describe('delete', () => {
    it('should delete customer by ID', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();

      await firstValueFrom(service.delete('CUST_123'));

      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/CUST_123',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.delete('CUST_123', '/custom/customers'));

      expect(fetch).toHaveBeenCalledWith('/custom/customers/CUST_123', expect.anything());
    });

    it('should handle delete errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: 'Cannot delete' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.delete('CUST_123'))).rejects.toThrow(
        'Cannot delete'
      );
    });
  });

  describe('search', () => {
    it('should search customers', async () => {
      const mockCustomers = [{ id: 'CUST_123' }, { id: 'CUST_456' }];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ customers: mockCustomers }),
      });

      const service = createService();

      const result = await firstValueFrom(
        service.search({ emailAddress: 'john@example.com' })
      );

      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/search',
        expect.objectContaining({ method: 'POST' })
      );
      expect(result).toEqual({ customers: mockCustomers });
    });

    it('should send search query in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(
        service.search({ emailAddress: 'test@example.com', phoneNumber: '+1234567890' })
      );

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.emailAddress).toBe('test@example.com');
      expect(body.phoneNumber).toBe('+1234567890');
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(
        service.search({ emailAddress: 'test@example.com' }, '/custom/customers')
      );

      expect(fetch).toHaveBeenCalledWith('/custom/customers/search', expect.anything());
    });

    it('should handle search errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Search failed' }),
      });

      const service = createService();

      await expect(
        firstValueFrom(service.search({ emailAddress: 'test@example.com' }))
      ).rejects.toThrow('Search failed');
    });
  });
});
