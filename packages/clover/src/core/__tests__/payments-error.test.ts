import { PaymentsError } from '@bates-solutions/payments-core/errors';
import { describe, expect, it } from 'vitest';
import * as errors from '../errors';
import * as entry from '../index';

type ErrorClass = abstract new (...args: never[]) => Error;

const classes = Object.entries(errors).filter(
  (entry): entry is [string, ErrorClass] =>
    typeof entry[1] === 'function' && entry[1].prototype instanceof Error
);

describe('CloverError and PaymentsError', () => {
  it('re-exports core PaymentsError from the package entry', () => {
    expect(entry.PaymentsError).toBe(PaymentsError);
  });

  it('finds every error class', () => {
    expect(classes.map(([name]) => name).sort()).toHaveLength(5);
  });

  it.each(classes)('%s is a CloverError and a PaymentsError', (_, ErrorClass) => {
    const prototype: unknown = ErrorClass.prototype;
    expect(ErrorClass === errors.CloverError || prototype instanceof errors.CloverError).toBe(true);
    expect(prototype instanceof PaymentsError).toBe(true);
    expect(prototype instanceof Error).toBe(true);
  });

  it('keeps the fields, own keys, name and stack of an instance', () => {
    function throwsHere(): never {
      throw new errors.CloverValidationError('clientId is required', 'clientId');
    }
    let caught: unknown;
    try {
      throwsHere();
    } catch (error) {
      caught = error;
    }
    const error = caught as InstanceType<typeof errors.CloverValidationError>;
    expect(error).toBeInstanceOf(errors.CloverValidationError);
    expect(error).toBeInstanceOf(errors.CloverError);
    expect(error).toBeInstanceOf(PaymentsError);
    expect(error.name).toBe('CloverValidationError');
    expect(error.code).toBe('INVALID_VALUE');
    expect(error.statusCode).toBe(400);
    expect(error.field).toBe('clientId');
    // The same own keys, in the same order, as before the base class moved.
    expect(Object.keys(error)).toEqual(['code', 'statusCode', 'details', 'name', 'field']);
    const stack = error.stack ?? '';
    expect(stack.split('\n')[0]).toBe('CloverValidationError: clientId is required');
    expect(stack).toContain('throwsHere');
    expect(stack).not.toContain('new CloverValidationError');
  });

  it('defaults the code to UNKNOWN', () => {
    const error = new errors.CloverError('boom');
    expect(error.code).toBe('UNKNOWN');
    expect(error.name).toBe('CloverError');
    expect(error.statusCode).toBeUndefined();
    expect(error.details).toBeUndefined();
  });
});
