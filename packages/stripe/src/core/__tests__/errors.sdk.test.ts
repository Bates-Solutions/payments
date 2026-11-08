import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';
import {
  StripeApiError,
  StripeAuthError,
  StripeError,
  StripePaymentError,
  parseStripeError,
} from '../errors.js';

// Real stripe-node error classes, built the way the SDK builds them from an
// API response. Their `type` is the class name; Stripe's own type is `rawType`.
const sdkErrors = (Stripe as unknown as { errors: Record<string, unknown> }).errors as {
  StripeError: { generate: (raw: Record<string, unknown>) => Error };
  generateOAuthError: (raw: Record<string, unknown>) => Error;
  StripeConnectionError: new (raw: Record<string, unknown>) => Error;
  StripePermissionError: new (raw: Record<string, unknown>) => Error;
  StripeAPIError: new (raw: Record<string, unknown>) => Error;
};

function fromApi(raw: Record<string, unknown>): Error {
  return sdkErrors.StripeError.generate(raw);
}

describe('parseStripeError with real stripe-node errors', () => {
  it('maps a card error with its decline details', () => {
    const err = parseStripeError(
      fromApi({
        type: 'card_error',
        code: 'card_declined',
        decline_code: 'insufficient_funds',
        message: 'Your card has insufficient funds.',
        statusCode: 402,
        payment_intent: { id: 'pi_1' },
      })
    );
    expect(err).toBeInstanceOf(StripePaymentError);
    // A decline stays CARD_DECLINED; the specific reason is on declineCode.
    expect(err.code).toBe('CARD_DECLINED');
    expect(err.statusCode).toBe(402);
    expect(err.message).toBe('Your card has insufficient funds.');
    expect((err as StripePaymentError).declineCode).toBe('insufficient_funds');
    expect((err as StripePaymentError).paymentIntentId).toBe('pi_1');
  });

  it('keeps card_declined when the decline code is generic or unknown', () => {
    const generic = parseStripeError(
      fromApi({
        type: 'card_error',
        code: 'card_declined',
        decline_code: 'generic_decline',
        statusCode: 402,
      })
    );
    expect(generic.code).toBe('CARD_DECLINED');
    expect((generic as StripePaymentError).declineCode).toBe('generic_decline');
  });

  it('maps a card error with no decline code', () => {
    const err = parseStripeError(
      fromApi({ type: 'card_error', code: 'expired_card', statusCode: 402 })
    );
    expect(err.code).toBe('EXPIRED_CARD');
    // stripe-node defaults a missing decline_code to ''
    expect((err as StripePaymentError).declineCode).toBeUndefined();
  });

  it('maps an invalid request to NOT_FOUND / CONFLICT / BAD_REQUEST by status', () => {
    const notFound = parseStripeError(
      fromApi({
        type: 'invalid_request_error',
        message: 'No such price',
        statusCode: 404,
        param: 'price',
        requestId: 'req_1',
      })
    );
    expect(notFound).toBeInstanceOf(StripeApiError);
    expect(notFound.code).toBe('NOT_FOUND');
    expect(notFound.statusCode).toBe(404);
    expect(notFound).toMatchObject({
      type: 'invalid_request_error',
      param: 'price',
      requestId: 'req_1',
    });

    expect(parseStripeError(fromApi({ type: 'invalid_request_error', statusCode: 409 })).code).toBe(
      'CONFLICT'
    );
    expect(parseStripeError(fromApi({ type: 'invalid_request_error', statusCode: 400 })).code).toBe(
      'BAD_REQUEST'
    );
  });

  it('maps a permission error to FORBIDDEN', () => {
    const err = parseStripeError(
      new sdkErrors.StripePermissionError({
        type: 'invalid_request_error',
        statusCode: 403,
        message: 'no access',
      })
    );
    expect(err).toBeInstanceOf(StripeApiError);
    expect(err.code).toBe('FORBIDDEN');
    expect(err.statusCode).toBe(403);
    expect(err).toMatchObject({ type: 'permission_error' });
  });

  it('maps a plain 403 invalid_request_error to FORBIDDEN', () => {
    const err = parseStripeError({ type: 'invalid_request_error', statusCode: 403 });
    expect(err.code).toBe('FORBIDDEN');
    expect(err.statusCode).toBe(403);
  });

  it('falls back to status 403 for a permission error without one', () => {
    const err = parseStripeError({ type: 'permission_error' });
    expect(err.code).toBe('FORBIDDEN');
    expect(err.statusCode).toBe(403);
  });

  it('maps a 403 invalid_request_error built by the SDK to FORBIDDEN', () => {
    expect(parseStripeError(fromApi({ type: 'invalid_request_error', statusCode: 403 })).code).toBe(
      'FORBIDDEN'
    );
  });

  // Stripe sends `invalid_request_error` as the type for a bad key and for
  // rate limits; only the status (and `code: rate_limit`) tells them apart.
  it('maps a 401 (bad API key) to StripeAuthError', () => {
    const err = parseStripeError(
      fromApi({
        type: 'invalid_request_error',
        statusCode: 401,
        message: 'Invalid API Key provided',
      })
    );
    expect(err).toBeInstanceOf(StripeAuthError);
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.message).toBe('Invalid API Key provided');
  });

  it('maps a 429 to RATE_LIMITED', () => {
    const err = parseStripeError(
      fromApi({ type: 'invalid_request_error', code: 'rate_limit', statusCode: 429 })
    );
    expect(err).toBeInstanceOf(StripeApiError);
    expect(err.code).toBe('RATE_LIMITED');
    expect(err.statusCode).toBe(429);
  });

  it('maps a 400 with code rate_limit to RATE_LIMITED', () => {
    const err = parseStripeError(
      fromApi({ type: 'invalid_request_error', code: 'rate_limit', statusCode: 400 })
    );
    expect(err.code).toBe('RATE_LIMITED');
    expect(err.statusCode).toBe(400);
  });

  it('trusts a specific SDK class over its rawType', () => {
    const errors = (Stripe as unknown as { errors: Record<string, new (raw: object) => Error> })
      .errors;
    // No status to refine by: only the class says what this is.
    const auth = parseStripeError(
      new errors.StripeAuthenticationError({ type: 'invalid_request_error' })
    );
    expect(auth).toBeInstanceOf(StripeAuthError);
    const rate = parseStripeError(
      new errors.StripeRateLimitError({ type: 'invalid_request_error' })
    );
    expect(rate.code).toBe('RATE_LIMITED');
  });

  it('maps plain 401 and 429 objects by status', () => {
    expect(parseStripeError({ type: 'invalid_request_error', statusCode: 401 })).toBeInstanceOf(
      StripeAuthError
    );
    expect(parseStripeError({ type: 'api_error', statusCode: 429 }).code).toBe('RATE_LIMITED');
    expect(
      parseStripeError({ type: 'invalid_request_error', statusCode: 400, code: 'rate_limit' }).code
    ).toBe('RATE_LIMITED');
    // A plain 400 without the rate_limit code stays a bad request
    expect(
      parseStripeError({
        type: 'invalid_request_error',
        statusCode: 400,
        code: 'parameter_missing',
      }).code
    ).toBe('BAD_REQUEST');
  });

  it('maps an idempotency error', () => {
    const idem = parseStripeError(fromApi({ type: 'idempotency_error', statusCode: 400 }));
    expect(idem.code).toBe('IDEMPOTENCY_ERROR');
  });

  it('maps a connection error (no response) to SERVICE_UNAVAILABLE', () => {
    const err = parseStripeError(
      new sdkErrors.StripeConnectionError({
        message: 'An error occurred with our connection to Stripe.',
      })
    );
    expect(err).toBeInstanceOf(StripeApiError);
    expect(err.code).toBe('SERVICE_UNAVAILABLE');
    expect(err.statusCode).toBe(503);
  });

  it('maps api errors by status', () => {
    expect(
      parseStripeError(new sdkErrors.StripeAPIError({ type: 'api_error', statusCode: 500 })).code
    ).toBe('INTERNAL_SERVER_ERROR');
    expect(
      parseStripeError(new sdkErrors.StripeAPIError({ type: 'api_error', statusCode: 503 })).code
    ).toBe('SERVICE_UNAVAILABLE');
  });

  it('maps Connect OAuth errors', () => {
    const grant = parseStripeError(
      sdkErrors.generateOAuthError({
        type: 'invalid_grant',
        message: 'Authorization code expired',
        statusCode: 400,
      })
    );
    expect(grant).toBeInstanceOf(StripeApiError);
    expect(grant.code).toBe('BAD_REQUEST');
    expect(grant).toMatchObject({ type: 'invalid_grant', message: 'Authorization code expired' });

    const client = parseStripeError(
      sdkErrors.generateOAuthError({ type: 'invalid_client', statusCode: 401 })
    );
    expect(client).toBeInstanceOf(StripeAuthError);

    for (const type of [
      'invalid_request',
      'invalid_scope',
      'unsupported_grant_type',
      'something_new',
    ]) {
      const err = parseStripeError(sdkErrors.generateOAuthError({ type, statusCode: 400 }));
      expect(err.code).toBe('BAD_REQUEST');
    }
  });
});

describe('parseStripeError edge cases', () => {
  it('maps authentication_required card errors', () => {
    expect(parseStripeError({ type: 'card_error', code: 'authentication_required' }).code).toBe(
      'AUTHENTICATION_REQUIRED'
    );
    // A decline whose reason is authentication_required is still a decline
    expect(
      parseStripeError({
        type: 'card_error',
        code: 'card_declined',
        decline_code: 'authentication_required',
      }).code
    ).toBe('CARD_DECLINED');
  });

  it('does not treat Object.prototype keys as known codes or classes', () => {
    expect(parseStripeError({ type: 'card_error', code: 'constructor' }).code).toBe(
      'CARD_DECLINED'
    );
    expect(
      parseStripeError({ type: 'card_error', code: 'card_declined', decline_code: 'toString' }).code
    ).toBe('CARD_DECLINED');
    const err = parseStripeError({ type: 'constructor', message: 'x' });
    expect(err).not.toBeInstanceOf(StripeApiError);
    expect(err.code).toBe('UNKNOWN');
  });

  it('uses the plain-object API type when there is no rawType', () => {
    expect(parseStripeError({ type: 'permission_error', statusCode: 403 }).code).toBe('FORBIDDEN');
  });

  it('falls back to raw.message and a default message', () => {
    expect(parseStripeError({ type: 'api_error', raw: { message: 'from raw' } }).message).toBe(
      'from raw'
    );
    expect(parseStripeError({ type: 'api_error', message: '' }).message).toBe('Stripe API error');
  });

  it('uses fallback statuses when the SDK gives none', () => {
    expect(parseStripeError({ type: 'rate_limit_error' }).statusCode).toBe(429);
    expect(parseStripeError({ type: 'invalid_request_error' }).statusCode).toBe(400);
    expect(parseStripeError({ type: 'api_error' }).statusCode).toBe(500);
  });

  it('leaves non-Stripe errors as UNKNOWN', () => {
    const err = parseStripeError(new TypeError('fetch failed'));
    expect(err).toBeInstanceOf(StripeError);
    expect(err.code).toBe('UNKNOWN');
  });
});
