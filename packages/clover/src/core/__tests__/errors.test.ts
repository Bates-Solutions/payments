import { describe, it, expect } from 'vitest';
import {
  CloverError,
  CloverApiError,
  CloverAuthError,
  CloverPaymentError,
  CloverValidationError,
  parseCloverError,
  cloverErrorFromResponse,
} from '../errors.js';

describe('cloverErrorFromResponse', () => {
  it('maps 401 to CloverAuthError', () => {
    const err = cloverErrorFromResponse(401, { message: 'bad token' });
    expect(err).toBeInstanceOf(CloverAuthError);
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.statusCode).toBe(401);
  });

  it('carries requestId and cloverCode on auth errors', () => {
    const err = cloverErrorFromResponse(403, { error: { code: 'forbidden', message: 'nope' } }, 'req_9');
    expect(err).toBeInstanceOf(CloverAuthError);
    expect((err as CloverAuthError).requestId).toBe('req_9');
    expect((err as CloverAuthError).cloverCode).toBe('forbidden');
  });

  it('carries requestId and cloverCode on payment errors', () => {
    const err = cloverErrorFromResponse(402, { error: { code: 'card_declined', message: 'declined' } }, 'req_10');
    expect(err).toBeInstanceOf(CloverPaymentError);
    expect((err as CloverPaymentError).requestId).toBe('req_10');
    expect((err as CloverPaymentError).cloverCode).toBe('card_declined');
  });

  it('maps 402 to CloverPaymentError with decline metadata', () => {
    const err = cloverErrorFromResponse(402, {
      error: { code: 'card_declined', message: 'declined', decline_code: 'insufficient_funds', charge: 'CHG_1' },
    });
    expect(err).toBeInstanceOf(CloverPaymentError);
    expect((err as CloverPaymentError).declineCode).toBe('insufficient_funds');
    expect((err as CloverPaymentError).chargeId).toBe('CHG_1');
  });

  it('maps 404 to a NOT_FOUND CloverApiError', () => {
    const err = cloverErrorFromResponse(404, { message: 'missing' }, 'req_1');
    expect(err).toBeInstanceOf(CloverApiError);
    expect(err.code).toBe('NOT_FOUND');
    expect((err as CloverApiError).requestId).toBe('req_1');
  });

  it('reads the nested ecommerce error message', () => {
    const err = cloverErrorFromResponse(400, { error: { code: 'x', message: 'nested msg' } });
    expect(err.message).toBe('nested msg');
    expect((err as CloverApiError).cloverCode).toBe('x');
  });

  it('maps 5xx to INTERNAL_SERVER_ERROR', () => {
    const err = cloverErrorFromResponse(500, {});
    expect(err.code).toBe('INTERNAL_SERVER_ERROR');
  });
});

describe('parseCloverError', () => {
  it('passes through an existing CloverError', () => {
    const original = new CloverValidationError('nope');
    expect(parseCloverError(original)).toBe(original);
  });

  it('wraps a plain Error', () => {
    const err = parseCloverError(new Error('network down'));
    expect(err).toBeInstanceOf(CloverError);
    expect(err.message).toBe('network down');
    expect(err.code).toBe('UNKNOWN');
  });

  it('handles a non-error value', () => {
    const err = parseCloverError('weird');
    expect(err).toBeInstanceOf(CloverError);
    expect(err.message).toBe('Unknown error occurred');
  });
});
