import { describe, it, expect, beforeEach } from 'vitest';
import { SquareModule, SQUARE_CONFIG } from '../square.module.js';

describe('SquareModule', () => {
  describe('forRoot', () => {
    it('should return module with providers for default config', () => {
      const result = SquareModule.forRoot({
        applicationId: 'sq0idp-test',
        locationId: 'LTEST123',
      });

      expect(result.ngModule).toBe(SquareModule);
      expect(result.providers).toBeDefined();
      expect(result.providers?.length).toBeGreaterThan(0);
    });

    it('should merge default values into config', () => {
      const result = SquareModule.forRoot({
        applicationId: 'sq0idp-test',
        locationId: 'LTEST123',
      });

      // Find the SQUARE_CONFIG provider
      const configProvider = result.providers?.find(
        (p) => typeof p === 'object' && 'provide' in p && p.provide === SQUARE_CONFIG
      ) as { provide: unknown; useValue: unknown } | undefined;

      expect(configProvider).toBeDefined();
      expect(configProvider?.useValue).toEqual({
        applicationId: 'sq0idp-test',
        locationId: 'LTEST123',
        environment: 'sandbox',
        currency: 'USD',
      });
    });

    it('should allow overriding default values', () => {
      const result = SquareModule.forRoot({
        applicationId: 'sq0idp-prod',
        locationId: 'LPROD123',
        environment: 'production',
        currency: 'EUR',
      });

      const configProvider = result.providers?.find(
        (p) => typeof p === 'object' && 'provide' in p && p.provide === SQUARE_CONFIG
      ) as { provide: unknown; useValue: unknown } | undefined;

      expect(configProvider?.useValue).toMatchObject({
        environment: 'production',
        currency: 'EUR',
      });
    });

    it('should include accessToken when provided', () => {
      const result = SquareModule.forRoot({
        applicationId: 'sq0idp-test',
        locationId: 'LTEST123',
        accessToken: 'secret-token',
      });

      const configProvider = result.providers?.find(
        (p) => typeof p === 'object' && 'provide' in p && p.provide === SQUARE_CONFIG
      ) as { provide: unknown; useValue: unknown } | undefined;

      expect((configProvider?.useValue as { accessToken?: string })?.accessToken).toBe(
        'secret-token'
      );
    });
  });

  describe('singleton guard', () => {
    it('should throw if parentModule is provided', () => {
      const parentModule = new SquareModule(undefined);

      expect(() => {
        new SquareModule(parentModule);
      }).toThrow('SquareModule is already loaded');
    });

    it('should not throw when parent is undefined', () => {
      expect(() => {
        new SquareModule(undefined);
      }).not.toThrow();
    });
  });
});
