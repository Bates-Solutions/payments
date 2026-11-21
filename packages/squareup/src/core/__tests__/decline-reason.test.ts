import { describe, it, expect } from 'vitest';
import {
  declineReason,
  parseSquareError,
  SquareApiError,
  SquareError,
  SquarePaymentError,
  SquareValidationError,
} from '../errors.js';

/** A decline as the SDK throws it: an HTTP error with Square's entries. */
function sdkDecline(code: string, category = 'PAYMENT_METHOD_ERROR'): unknown {
  return {
    statusCode: 402,
    body: { errors: [{ category, code, detail: `Declined: ${code}` }] },
  };
}

describe('declineReason', () => {
  it.each([
    ['INSUFFICIENT_FUNDS', true],
    ['TRANSACTION_LIMIT', true],
    ['GENERIC_DECLINE', false],
    ['CVV_FAILURE', false],
    ['ADDRESS_VERIFICATION_FAILURE', false],
    ['CARD_EXPIRED', false],
    ['INVALID_ACCOUNT', false],
    ['CARD_DECLINED_CALL_ISSUER', false],
    ['CARD_DECLINED_VERIFICATION_REQUIRED', false],
    // A transient Square failure, not a decline: isRetryableSquareError covers
    // it, with the same idempotency key.
    ['TEMPORARY_ERROR', false],
  ])('maps %s to retryable: %s', (code, retryable) => {
    const error = parseSquareError(sdkDecline(code));

    expect(error).toBeInstanceOf(SquarePaymentError);
    expect(declineReason(error)).toEqual({ code, retryable });
  });

  it('keeps the raw Square code even when the typed code is UNKNOWN', () => {
    const error = parseSquareError(sdkDecline('INSUFFICIENT_FUNDS')) as SquarePaymentError;

    expect(error.code).toBe('UNKNOWN');
    expect(error.errors[0]?.code).toBe('INSUFFICIENT_FUNDS');
    expect(declineReason(error)?.code).toBe('INSUFFICIENT_FUNDS');
  });

  it('treats an unknown code as not retryable', () => {
    expect(declineReason(parseSquareError(sdkDecline('SOME_NEW_DECLINE')))).toEqual({
      code: 'SOME_NEW_DECLINE',
      retryable: false,
    });
  });

  it('reads a decline reported in a 200 response', () => {
    // assertNoResponseErrors goes through the same entry mapping with status 200.
    const error = parseSquareError({
      statusCode: 200,
      body: { errors: [{ category: 'PAYMENT_METHOD_ERROR', code: 'TRANSACTION_LIMIT' }] },
    });

    expect(declineReason(error)).toEqual({ code: 'TRANSACTION_LIMIT', retryable: true });
  });

  it('finds a PAYMENT_METHOD_ERROR entry on a SquareApiError', () => {
    const error = new SquareApiError('failed', 'UNKNOWN', 400, [
      { category: 'INVALID_REQUEST_ERROR', code: 'INVALID_VALUE' },
      { category: 'PAYMENT_METHOD_ERROR', code: 'GENERIC_DECLINE' },
    ]);

    expect(declineReason(error)).toEqual({ code: 'GENERIC_DECLINE', retryable: false });
  });

  it('falls back to the typed code of a SquarePaymentError without entries', () => {
    expect(declineReason(new SquarePaymentError('declined', 'CARD_EXPIRED'))).toEqual({
      code: 'CARD_EXPIRED',
      retryable: false,
    });
    expect(declineReason(new SquarePaymentError('declined', 'UNKNOWN'))).toBeUndefined();
  });

  it('returns undefined for errors that are not declines', () => {
    expect(declineReason(new SquareValidationError('bad', 'amount'))).toBeUndefined();
    expect(declineReason(new SquareError('boom'))).toBeUndefined();
    expect(
      declineReason(parseSquareError(sdkDecline('INVALID_VALUE', 'INVALID_REQUEST_ERROR')))
    ).toBeUndefined();
    expect(declineReason(new Error('plain'))).toBeUndefined();
    expect(declineReason(undefined)).toBeUndefined();
  });
});
