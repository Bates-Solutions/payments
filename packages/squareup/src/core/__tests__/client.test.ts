import { describe, it, expect } from 'vitest';
import { createSquareClient, SquareClient } from '../client.js';

describe('SquareClient', () => {
  describe('createSquareClient', () => {
    it('should create a client with minimal config', () => {
      const client = createSquareClient({
        accessToken: 'test-token',
      });

      expect(client).toBeInstanceOf(SquareClient);
      expect(client.environment).toBe('sandbox');
      expect(client.locationId).toBeUndefined();
    });

    it('should create a client with full config', () => {
      const client = createSquareClient({
        accessToken: 'test-token',
        environment: 'production',
        locationId: 'LXXX',
        defaultCurrency: 'EUR',
      });

      expect(client.environment).toBe('production');
      expect(client.locationId).toBe('LXXX');
    });

    it('should expose payments service', () => {
      const client = createSquareClient({
        accessToken: 'test-token',
      });

      expect(client.payments).toBeDefined();
      expect(typeof client.payments.create).toBe('function');
      expect(typeof client.payments.get).toBe('function');
      expect(typeof client.payments.cancel).toBe('function');
      expect(typeof client.payments.list).toBe('function');
    });

    it('should expose orders service', () => {
      const client = createSquareClient({
        accessToken: 'test-token',
      });

      expect(client.orders).toBeDefined();
      expect(typeof client.orders.create).toBe('function');
      expect(typeof client.orders.get).toBe('function');
      expect(typeof client.orders.builder).toBe('function');
    });

    it('should expose underlying SDK client', () => {
      const client = createSquareClient({
        accessToken: 'test-token',
      });

      expect(client.sdk).toBeDefined();
    });
  });
});
