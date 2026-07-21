import { describe, it, expect } from 'vitest';
import {
  StripeError,
  StripeApiError,
  StripeAuthError,
  StripePaymentError,
  StripeValidationError,
  parseStripeError,
} from '../errors.js';

describe('error classes', () => {
  it('StripeError carries code, statusCode, and details', () => {
    const err = new StripeError('boom', 'BAD_REQUEST', 400, { foo: 'bar' });
    expect(err.message).toBe('boom');
    expect(err.code).toBe('BAD_REQUEST');
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual({ foo: 'bar' });
    expect(err.name).toBe('StripeError');
  });

  it('StripeValidationError defaults to INVALID_VALUE and 400', () => {
    const err = new StripeValidationError('bad field', 'amount');
    expect(err.code).toBe('INVALID_VALUE');
    expect(err.statusCode).toBe(400);
    expect(err.field).toBe('amount');
  });

  it('StripePaymentError carries decline metadata', () => {
    const err = new StripePaymentError('declined', 'CARD_DECLINED', {
      paymentIntentId: 'pi_1',
      declineCode: 'insufficient_funds',
    });
    expect(err.statusCode).toBe(402);
    expect(err.paymentIntentId).toBe('pi_1');
    expect(err.declineCode).toBe('insufficient_funds');
  });
});

describe('parseStripeError', () => {
  it('passes through an existing StripeError unchanged', () => {
    const original = new StripeValidationError('nope');
    expect(parseStripeError(original)).toBe(original);
  });

  it('maps authentication_error to StripeAuthError', () => {
    const err = parseStripeError({ type: 'authentication_error', statusCode: 401, message: 'bad key' });
    expect(err).toBeInstanceOf(StripeAuthError);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('maps card_error to StripePaymentError with decline code', () => {
    const err = parseStripeError({
      type: 'card_error',
      code: 'expired_card',
      decline_code: 'expired_card',
      message: 'expired',
      statusCode: 402,
    });
    expect(err).toBeInstanceOf(StripePaymentError);
    expect(err.code).toBe('EXPIRED_CARD');
  });

  it('maps a 404 invalid_request_error to NOT_FOUND', () => {
    const err = parseStripeError({ type: 'invalid_request_error', statusCode: 404, message: 'no such' });
    expect(err).toBeInstanceOf(StripeApiError);
    expect(err.code).toBe('NOT_FOUND');
  });

  it('maps rate_limit_error to RATE_LIMITED', () => {
    const err = parseStripeError({ type: 'rate_limit_error', statusCode: 429, message: 'slow down' });
    expect(err).toBeInstanceOf(StripeApiError);
    expect(err.code).toBe('RATE_LIMITED');
  });

  it('wraps a plain Error', () => {
    const err = parseStripeError(new Error('kaboom'));
    expect(err).toBeInstanceOf(StripeError);
    expect(err.message).toBe('kaboom');
    expect(err.code).toBe('UNKNOWN');
  });

  it('handles a non-error value', () => {
    const err = parseStripeError('nope');
    expect(err).toBeInstanceOf(StripeError);
    expect(err.message).toBe('Unknown error occurred');
  });
});
