import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaymentsError } from '../payments-error';

type Code = 'NOT_FOUND' | 'UNKNOWN';

class ProviderError extends PaymentsError<Code> {
  constructor(message: string, code: Code = 'UNKNOWN', statusCode?: number, details?: unknown) {
    super(message, code, statusCode, details);
    this.name = 'ProviderError';
  }
}

class ProviderApiError extends ProviderError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'ProviderApiError';
  }
}

describe('PaymentsError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('carries the message, code, status and details', () => {
    const details = { raw: true };
    const error = new PaymentsError('boom', 'X', 500, details);
    expect(error.message).toBe('boom');
    expect(error.name).toBe('PaymentsError');
    expect(error.code).toBe('X');
    expect(error.statusCode).toBe(500);
    expect(error.details).toBe(details);
  });

  it('leaves status and details undefined when not given', () => {
    const error = new PaymentsError('boom', 'X');
    expect(error.statusCode).toBeUndefined();
    expect(error.details).toBeUndefined();
    // Class fields are defined before the constructor body, so name comes last,
    // as it did in the providers' old error classes.
    expect(Object.keys(error)).toEqual(['code', 'statusCode', 'details', 'name']);
  });

  it('keeps the instanceof chain of a subclass', () => {
    const error = new ProviderApiError('missing');
    expect(error).toBeInstanceOf(ProviderApiError);
    expect(error).toBeInstanceOf(ProviderError);
    expect(error).toBeInstanceOf(PaymentsError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ProviderApiError');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });

  it('starts the stack where the error was thrown, not in the constructors', () => {
    function throwsHere(): never {
      throw new ProviderApiError('missing');
    }
    let stack = '';
    try {
      throwsHere();
    } catch (error) {
      stack = (error as Error).stack ?? '';
    }
    expect(stack.split('\n')[0]).toBe('ProviderApiError: missing');
    expect(stack).toContain('throwsHere');
    expect(stack).not.toContain('new ProviderApiError');
    expect(stack).not.toContain('new ProviderError');
    expect(stack).not.toContain('new PaymentsError');
  });

  it('passes the leaf class to captureStackTrace', () => {
    const capture = vi.spyOn(Error, 'captureStackTrace');
    const error = new ProviderApiError('missing');
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(error, ProviderApiError);
  });

  it('works where Error.captureStackTrace does not exist', () => {
    const original = Error.captureStackTrace;
    // Simulate a non-V8 engine.
    (Error as { captureStackTrace?: unknown }).captureStackTrace = undefined;
    try {
      const error = new ProviderError('boom');
      expect(error).toBeInstanceOf(PaymentsError);
      expect(error.message).toBe('boom');
    } finally {
      Error.captureStackTrace = original;
    }
  });
});

describe('instanceof PaymentsError across copies of payments-core', () => {
  // A second copy, as when two providers install different core versions:
  // resetModules makes the import evaluate the module again, with its own class.
  async function loadSecondCopy(): Promise<typeof PaymentsError> {
    vi.resetModules();
    const copy = await import('../payments-error');
    expect(copy.PaymentsError).not.toBe(PaymentsError);
    return copy.PaymentsError;
  }

  it('matches an error from another copy', async () => {
    const OtherPaymentsError = await loadSecondCopy();
    class OtherProviderError extends OtherPaymentsError<Code> {}

    expect(new OtherPaymentsError('boom', 'X')).toBeInstanceOf(PaymentsError);
    expect(new OtherProviderError('boom', 'UNKNOWN')).toBeInstanceOf(PaymentsError);
    expect(new ProviderApiError('missing')).toBeInstanceOf(OtherPaymentsError);
  });

  it('keeps subclass checks to the real prototype chain', async () => {
    const OtherPaymentsError = await loadSecondCopy();
    class OtherProviderError extends OtherPaymentsError<Code> {}
    class SiblingError extends PaymentsError<Code> {}

    expect(new OtherProviderError('boom', 'UNKNOWN')).not.toBeInstanceOf(ProviderError);
    expect(new SiblingError('boom', 'UNKNOWN')).not.toBeInstanceOf(ProviderError);
    expect(new ProviderError('boom')).not.toBeInstanceOf(ProviderApiError);
    expect(new ProviderApiError('missing')).toBeInstanceOf(ProviderError);
  });

  it('rejects values that are not payments errors', () => {
    for (const value of [
      new Error('plain'),
      { code: 'X', statusCode: 500 },
      Object.create(null),
      null,
      undefined,
      'PaymentsError',
      42,
      () => undefined,
      PaymentsError.prototype,
    ]) {
      expect(value instanceof PaymentsError).toBe(false);
    }
  });

  it('adds nothing to the error own keys or JSON', () => {
    const error = new PaymentsError('boom', 'X');
    expect(Object.getOwnPropertySymbols(error)).toEqual([]);
    expect(JSON.stringify(error)).toBe('{"code":"X","name":"PaymentsError"}');
    const brand = Symbol.for('@bates-solutions/payments-core/PaymentsError');
    expect(Object.getOwnPropertyDescriptor(PaymentsError.prototype, brand)).toEqual({
      value: true,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  });
});
