import { PaymentsError } from '@bates-solutions/payments-core/errors';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as errors from '../errors';
import * as entry from '../index';

type ErrorClass = abstract new (...args: never[]) => Error;

const classes = Object.entries(errors).filter(
  (entry): entry is [string, ErrorClass] =>
    typeof entry[1] === 'function' && entry[1].prototype instanceof Error
);

describe('SquareError and PaymentsError', () => {
  it('re-exports core PaymentsError from the package entry', () => {
    expect(entry.PaymentsError).toBe(PaymentsError);
  });

  it('finds every error class', () => {
    expect(classes.map(([name]) => name).sort()).toHaveLength(6);
  });

  it.each(classes)('%s is a SquareError and a PaymentsError', (_, ErrorClass) => {
    const prototype: unknown = ErrorClass.prototype;
    expect(ErrorClass === errors.SquareError || prototype instanceof errors.SquareError).toBe(true);
    expect(prototype instanceof PaymentsError).toBe(true);
    expect(prototype instanceof Error).toBe(true);
  });

  it('keeps the fields, own keys, name and stack of an instance', () => {
    function throwsHere(): never {
      throw new errors.SquareValidationError('clientId is required', 'clientId');
    }
    let caught: unknown;
    try {
      throwsHere();
    } catch (error) {
      caught = error;
    }
    const error = caught as InstanceType<typeof errors.SquareValidationError>;
    expect(error).toBeInstanceOf(errors.SquareValidationError);
    expect(error).toBeInstanceOf(errors.SquareError);
    expect(error).toBeInstanceOf(PaymentsError);
    expect(error.name).toBe('SquareValidationError');
    expect(error.code).toBe('INVALID_VALUE');
    expect(error.statusCode).toBe(400);
    expect(error.field).toBe('clientId');
    // The same own keys, in the same order, as before the base class moved.
    expect(Object.keys(error)).toEqual(['code', 'statusCode', 'details', 'name', 'field']);
    const stack = error.stack ?? '';
    expect(stack.split('\n')[0]).toBe('SquareValidationError: clientId is required');
    expect(stack).toContain('throwsHere');
    expect(stack).not.toContain('new SquareValidationError');
  });

  it('defaults the code to UNKNOWN', () => {
    const error = new errors.SquareError('boom');
    expect(error.code).toBe('UNKNOWN');
    expect(error.name).toBe('SquareError');
    expect(error.statusCode).toBeUndefined();
    expect(error.details).toBeUndefined();
  });

  it('is a PaymentsError of another copy of payments-core', async () => {
    // A second copy on disk, as when another provider installs a different core
    // version: core's built errors entry, copied to a temp directory and imported.
    const entry = fileURLToPath(import.meta.resolve('@bates-solutions/payments-core/errors'));
    const dir = mkdtempSync(join(tmpdir(), 'payments-core-copy-'));
    try {
      cpSync(dirname(entry), dir, { recursive: true });
      const copy = (await import(pathToFileURL(join(dir, 'index.js')).href)) as {
        PaymentsError: typeof PaymentsError;
      };
      expect(copy.PaymentsError).not.toBe(PaymentsError);
      expect(new errors.SquareValidationError('clientId is required', 'clientId')).toBeInstanceOf(
        copy.PaymentsError
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
