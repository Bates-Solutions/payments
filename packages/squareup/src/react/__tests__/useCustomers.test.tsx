import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCustomers } from '../hooks/useCustomers.js';

describe('useCustomers', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with null data', () => {
      const { result } = renderHook(() => useCustomers());

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should have all required functions', () => {
      const { result } = renderHook(() => useCustomers());

      expect(typeof result.current.create).toBe('function');
      expect(typeof result.current.get).toBe('function');
      expect(typeof result.current.update).toBe('function');
      expect(typeof result.current.search).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('create', () => {
    it('should create customer successfully', async () => {
      const mockCustomer = {
        id: 'CUST_123',
        givenName: 'John',
        familyName: 'Doe',
        emailAddress: 'john@example.com',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCustomer),
      });

      const { result } = renderHook(() => useCustomers());

      let customer;
      await act(async () => {
        customer = await result.current.create({
          givenName: 'John',
          familyName: 'Doe',
          emailAddress: 'john@example.com',
        });
      });

      expect(customer).toEqual(mockCustomer);
      expect(result.current.data).toEqual(mockCustomer);
      expect(result.current.error).toBeNull();
    });

    it('should use default /api/customers endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'CUST_123' }),
      });

      const { result } = renderHook(() => useCustomers());

      await act(async () => {
        await result.current.create({ givenName: 'John' });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/customers',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should send customer input in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'CUST_123' }),
      });

      const { result } = renderHook(() => useCustomers());

      await act(async () => {
        await result.current.create({
          givenName: 'John',
          familyName: 'Doe',
          emailAddress: 'john@example.com',
          phoneNumber: '+1234567890',
          companyName: 'Acme Inc',
          address: {
            addressLine1: '123 Main St',
            locality: 'San Francisco',
            administrativeDistrictLevel1: 'CA',
            postalCode: '94105',
            country: 'US',
          },
        });
      });

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);

      expect(body.givenName).toBe('John');
      expect(body.familyName).toBe('Doe');
      expect(body.emailAddress).toBe('john@example.com');
      expect(body.phoneNumber).toBe('+1234567890');
      expect(body.companyName).toBe('Acme Inc');
      expect(body.address.addressLine1).toBe('123 Main St');
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid email' }),
      });

      const { result } = renderHook(() => useCustomers());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.create({ emailAddress: 'invalid' });
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Invalid email');
      expect(result.current.error?.message).toBe('Invalid email');
    });

    it('should call onSuccess callback', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'John' };
      const onSuccess = vi.fn();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCustomer),
      });

      const { result } = renderHook(() => useCustomers({ onSuccess }));

      await act(async () => {
        await result.current.create({ givenName: 'John' });
      });

      expect(onSuccess).toHaveBeenCalledWith(mockCustomer);
    });
  });

  describe('get', () => {
    it('should get customer successfully', async () => {
      const mockCustomer = {
        id: 'CUST_123',
        givenName: 'John',
        familyName: 'Doe',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCustomer),
      });

      const { result } = renderHook(() => useCustomers());

      let customer;
      await act(async () => {
        customer = await result.current.get('CUST_123');
      });

      expect(customer).toEqual(mockCustomer);
      expect(result.current.data).toEqual(mockCustomer);
      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/CUST_123',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should handle get error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Customer not found' }),
      });

      const { result } = renderHook(() => useCustomers());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.get('INVALID');
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Customer not found');
    });
  });

  describe('update', () => {
    it('should update customer successfully', async () => {
      const mockCustomer = {
        id: 'CUST_123',
        givenName: 'Jane',
        familyName: 'Doe',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCustomer),
      });

      const { result } = renderHook(() => useCustomers());

      let customer;
      await act(async () => {
        customer = await result.current.update('CUST_123', {
          givenName: 'Jane',
        });
      });

      expect(customer).toEqual(mockCustomer);
      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/CUST_123',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should call onSuccess on update', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'Jane' };
      const onSuccess = vi.fn();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCustomer),
      });

      const { result } = renderHook(() => useCustomers({ onSuccess }));

      await act(async () => {
        await result.current.update('CUST_123', { givenName: 'Jane' });
      });

      expect(onSuccess).toHaveBeenCalledWith(mockCustomer);
    });

    it('should handle update error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve({ message: 'Update failed' }),
      });

      const { result } = renderHook(() => useCustomers());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.update('CUST_123', { givenName: 'Jane' });
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Update failed');
    });
  });

  describe('search', () => {
    it('should search by email', async () => {
      const mockCustomers = [
        { id: 'CUST_1', emailAddress: 'john@example.com' },
        { id: 'CUST_2', emailAddress: 'john.doe@example.com' },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ customers: mockCustomers }),
      });

      const { result } = renderHook(() => useCustomers());

      let customers;
      await act(async () => {
        customers = await result.current.search({ email: 'john@example.com' });
      });

      expect(customers).toEqual(mockCustomers);
      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/search?email=john%40example.com',
        expect.anything()
      );
    });

    it('should search by phone', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ customers: [] }),
      });

      const { result } = renderHook(() => useCustomers());

      await act(async () => {
        await result.current.search({ phone: '+1234567890' });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/customers/search?phone=%2B1234567890',
        expect.anything()
      );
    });

    it('should search by both email and phone', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ customers: [] }),
      });

      const { result } = renderHook(() => useCustomers());

      await act(async () => {
        await result.current.search({
          email: 'test@example.com',
          phone: '+1234567890',
        });
      });

      const call = vi.mocked(fetch).mock.calls[0];
      expect(call[0]).toContain('email=test%40example.com');
      expect(call[0]).toContain('phone=%2B1234567890');
    });

    it('should handle search error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve({ message: 'Search failed' }),
      });

      const { result } = renderHook(() => useCustomers());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.search({ email: 'test@example.com' });
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Search failed');
    });
  });

  describe('reset', () => {
    it('should reset state', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'John' };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCustomer),
      });

      const { result } = renderHook(() => useCustomers());

      await act(async () => {
        await result.current.create({ givenName: 'John' });
      });

      expect(result.current.data).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
});
