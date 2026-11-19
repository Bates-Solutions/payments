import { describe, expect, it } from 'vitest';
import { requireNonEmpty } from '../require-non-empty';

class FieldError extends Error {
  constructor(
    message: string,
    public readonly field: string
  ) {
    super(message);
  }
}

const toError = (message: string, field: string) => new FieldError(message, field);

describe('requireNonEmpty', () => {
  it('passes a non-empty string', () => {
    expect(() => {
      requireNonEmpty('abc', 'clientId', toError);
    }).not.toThrow();
  });

  it.each([
    ['undefined', undefined],
    ['an empty string', ''],
  ])('throws the given error for %s', (_, value) => {
    let thrown: unknown;
    try {
      requireNonEmpty(value, 'clientId', toError);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(FieldError);
    expect((thrown as FieldError).message).toBe('clientId is required');
    expect((thrown as FieldError).field).toBe('clientId');
  });

  it('does not trim, matching the providers: whitespace passes', () => {
    expect(() => {
      requireNonEmpty(' ', 'clientId', toError);
    }).not.toThrow();
  });
});
