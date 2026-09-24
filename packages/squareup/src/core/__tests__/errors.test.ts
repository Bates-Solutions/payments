import { afterEach, describe, it, expect, vi } from 'vitest';
import { SquareClient as SdkClient, SquareTimeoutError } from 'square';
import {
  SquareError,
  SquareApiError,
  SquareAuthError,
  SquareValidationError,
  SquarePaymentError,
  parseSquareError,
  assertNoResponseErrors,
  SquareNetworkError,
  isRetryableSquareError,
} from '../errors.js';

describe('Error Classes', () => {
  describe('SquareError', () => {
    it('should create an error with message', () => {
      const error = new SquareError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('SquareError');
      expect(error.code).toBe('UNKNOWN'); // default code
    });

    it('should include optional properties', () => {
      const error = new SquareError('Test error', 'BAD_REQUEST', 400, { extra: 'info' });
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ extra: 'info' });
    });

    it('should be instanceof Error', () => {
      const error = new SquareError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(SquareError);
    });
  });

  describe('SquareApiError', () => {
    it('should create an API error with Square errors array', () => {
      const errors = [
        { category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST', detail: 'Invalid data' },
      ];
      const error = new SquareApiError('API Error', 'BAD_REQUEST', 400, errors);
      expect(error.message).toBe('API Error');
      expect(error.name).toBe('SquareApiError');
      expect(error.errors).toEqual(errors);
      expect(error.statusCode).toBe(400);
    });

    it('should be instanceof SquareError', () => {
      const error = new SquareApiError('API Error', 'BAD_REQUEST', 400, []);
      expect(error).toBeInstanceOf(SquareError);
      expect(error).toBeInstanceOf(SquareApiError);
    });
  });

  describe('SquareAuthError', () => {
    it('should create an auth error with default code', () => {
      const error = new SquareAuthError('Invalid token');
      expect(error.message).toBe('Invalid token');
      expect(error.name).toBe('SquareAuthError');
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.statusCode).toBe(401);
    });

    it('should accept custom auth error code', () => {
      const error = new SquareAuthError('Token expired', 'ACCESS_TOKEN_EXPIRED');
      expect(error.code).toBe('ACCESS_TOKEN_EXPIRED');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('SquareValidationError', () => {
    it('should create a validation error', () => {
      const error = new SquareValidationError('Invalid amount', 'amount');
      expect(error.message).toBe('Invalid amount');
      expect(error.name).toBe('SquareValidationError');
      expect(error.field).toBe('amount');
      expect(error.code).toBe('INVALID_VALUE');
      expect(error.statusCode).toBe(400);
    });

    it('should work without field parameter', () => {
      const error = new SquareValidationError('Validation failed');
      expect(error.field).toBeUndefined();
    });
  });

  describe('SquarePaymentError', () => {
    it('should create a payment error', () => {
      const error = new SquarePaymentError('Payment declined', 'CARD_DECLINED', 'PAY_123');
      expect(error.message).toBe('Payment declined');
      expect(error.name).toBe('SquarePaymentError');
      expect(error.paymentId).toBe('PAY_123');
      expect(error.code).toBe('CARD_DECLINED');
      expect(error.statusCode).toBe(400);
    });

    it('should work without paymentId', () => {
      const error = new SquarePaymentError('CVV failure', 'VERIFY_CVV_FAILURE');
      expect(error.paymentId).toBeUndefined();
    });
  });

  describe('parseSquareError', () => {
    it('should parse SDK error with 401 status', () => {
      const error = parseSquareError({
        statusCode: 401,
        body: {
          errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED', detail: 'Invalid token' }],
        },
      });

      expect(error).toBeInstanceOf(SquareAuthError);
      expect(error.message).toBe('Invalid token');
    });

    it('should parse SDK error with PAYMENT_METHOD_ERROR category', () => {
      const error = parseSquareError({
        statusCode: 400,
        body: {
          errors: [{ category: 'PAYMENT_METHOD_ERROR', code: 'CARD_DECLINED', detail: 'Card was declined' }],
        },
      });

      expect(error).toBeInstanceOf(SquarePaymentError);
      expect(error.message).toBe('Card was declined');
    });

    it('should parse SDK error as general API error', () => {
      const error = parseSquareError({
        statusCode: 404,
        body: {
          errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND', detail: 'Resource not found' }],
        },
      });

      expect(error).toBeInstanceOf(SquareApiError);
      expect(error.message).toBe('Resource not found');
    });

    it('should wrap standard Error', () => {
      const error = parseSquareError(new Error('Something went wrong'));

      expect(error).toBeInstanceOf(SquareError);
      expect(error.message).toBe('Something went wrong');
    });

    it('should return unknown error for non-Error types', () => {
      const error = parseSquareError('string error');

      expect(error).toBeInstanceOf(SquareError);
      expect(error.message).toBe('Unknown error occurred');
    });

    it('should return unknown error for null', () => {
      const error = parseSquareError(null);

      expect(error).toBeInstanceOf(SquareError);
      expect(error.message).toBe('Unknown error occurred');
    });

    it('should return unknown error for undefined', () => {
      const error = parseSquareError(undefined);

      expect(error).toBeInstanceOf(SquareError);
      expect(error.message).toBe('Unknown error occurred');
    });

    it('should handle an SDK error with no body', () => {
      const error = parseSquareError({ statusCode: 503 });

      expect(error).toBeInstanceOf(SquareApiError);
      expect(error).toMatchObject({ message: 'Square API error', code: 'UNKNOWN', statusCode: 503, errors: [] });
    });

    it('should return an already-typed SquareError unchanged', () => {
      const original = new SquareApiError('Scope missing', 'INSUFFICIENT_SCOPES', 200, [
        { category: 'AUTHENTICATION_ERROR', code: 'INSUFFICIENT_SCOPES', detail: 'Scope missing' },
      ]);

      expect(parseSquareError(original)).toBe(original);
    });
  });

  describe('assertNoResponseErrors', () => {
    it('should not throw when errors is absent, null or empty', () => {
      expect(() => assertNoResponseErrors({})).not.toThrow();
      expect(() => assertNoResponseErrors({ errors: null })).not.toThrow();
      expect(() => assertNoResponseErrors({ errors: [] })).not.toThrow();
    });

    it('should throw a SquareApiError carrying the errors array', () => {
      const errors = [
        { category: 'AUTHENTICATION_ERROR', code: 'INSUFFICIENT_SCOPES', detail: 'Scope missing', field: null },
      ];

      let thrown: unknown;
      try {
        assertNoResponseErrors({ errors });
      } catch (e) {
        thrown = e;
      }

      expect(thrown).toBeInstanceOf(SquareApiError);
      expect(thrown).toMatchObject({
        message: 'Scope missing',
        code: 'INSUFFICIENT_SCOPES',
        statusCode: 200,
        errors: [{ category: 'AUTHENTICATION_ERROR', code: 'INSUFFICIENT_SCOPES', detail: 'Scope missing' }],
      });
    });

    it('should keep a non-null field and fall back to a generic message without detail', () => {
      let thrown: unknown;
      try {
        assertNoResponseErrors({
          errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'INVALID_VALUE', detail: null, field: 'location_id' }],
        });
      } catch (e) {
        thrown = e;
      }

      expect(thrown).toMatchObject({
        message: 'Square API error',
        code: 'INVALID_VALUE',
        errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'INVALID_VALUE', field: 'location_id' }],
      });
      expect((thrown as SquareApiError).errors[0]).not.toHaveProperty('detail');
    });

    it('should classify PAYMENT_METHOD_ERROR as SquarePaymentError', () => {
      expect(() =>
        assertNoResponseErrors({ errors: [{ category: 'PAYMENT_METHOD_ERROR', code: 'CARD_DECLINED' }] })
      ).toThrow(SquarePaymentError);
    });
  });

  describe('network failures and timeouts', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('maps a real SDK network failure to SquareNetworkError, keeping the message and cause', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
      const sdk = new SdkClient({ token: 'test-token', maxRetries: 0 });

      const sdkError = await sdk.locations.list().catch((e: unknown) => e);
      const error = parseSquareError(sdkError);

      expect(error).toBeInstanceOf(SquareNetworkError);
      expect(error).toMatchObject({ code: 'NETWORK_ERROR', statusCode: undefined });
      expect(error.message).toContain('fetch failed');
      expect(error.cause).toBe(sdkError);
    });

    it('maps SquareTimeoutError to SquareNetworkError with code TIMEOUT', () => {
      const timeout = new SquareTimeoutError('Timeout exceeded when calling GET /v2/locations.');

      const error = parseSquareError(timeout);

      expect(error).toBeInstanceOf(SquareNetworkError);
      expect(error).toMatchObject({ code: 'TIMEOUT', message: timeout.message });
      expect(error.cause).toBe(timeout);
    });

    it('still maps an SDK error with a numeric status code as an HTTP error', () => {
      const error = parseSquareError({ statusCode: 502, body: '<html>Bad Gateway</html>' });

      expect(error).toBeInstanceOf(SquareApiError);
      expect(error).toMatchObject({ statusCode: 502 });
    });

    it('treats a plain object with a non-numeric statusCode as unknown', () => {
      const error = parseSquareError({ statusCode: undefined });

      expect(error).not.toBeInstanceOf(SquareNetworkError);
      expect(error.message).toBe('Unknown error occurred');
    });
  });

  describe('isRetryableSquareError', () => {
    it.each([
      ['network failure', new SquareNetworkError('fetch failed', 'NETWORK_ERROR')],
      ['timeout', new SquareNetworkError('timed out', 'TIMEOUT')],
      ['408', new SquareApiError('request timeout', 'UNKNOWN', 408, [])],
      ['429', new SquareApiError('slow down', 'RATE_LIMITED', 429, [])],
      ['500', new SquareApiError('oops', 'INTERNAL_SERVER_ERROR', 500, [])],
      ['503', new SquareApiError('down', 'SERVICE_UNAVAILABLE', 503, [])],
    ])('is true for a %s', (_label, error) => {
      expect(isRetryableSquareError(error)).toBe(true);
    });

    it.each([
      ['400', new SquareApiError('bad', 'BAD_REQUEST', 400, [])],
      ['404', new SquareApiError('missing', 'NOT_FOUND', 404, [])],
      ['200 errors body', new SquareApiError('scope', 'INSUFFICIENT_SCOPES', 200, [])],
      ['auth error', new SquareAuthError('no')],
      ['payment decline', new SquarePaymentError('declined', 'CARD_DECLINED')],
      ['validation error', new SquareValidationError('bad input')],
      ['untyped SquareError', new SquareError('something')],
      ['plain Error', new Error('boom')],
      ['non-error', 'string'],
    ])('is false for a %s', (_label, error) => {
      expect(isRetryableSquareError(error)).toBe(false);
    });
  });
});
