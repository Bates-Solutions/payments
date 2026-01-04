import { describe, it, expect } from 'vitest';
import {
  SquareError,
  SquareApiError,
  SquareAuthError,
  SquareValidationError,
  SquarePaymentError,
  parseSquareError,
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
  });
});
