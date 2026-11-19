import { describe, expect, it } from 'vitest';
import * as cryptoEntry from '../crypto/index';
import * as root from '../index';

describe('entry points', () => {
  it('exports the crypto primitives from ./crypto', () => {
    expect(Object.keys(cryptoEntry).sort()).toEqual([
      'hmacSha256',
      'timingSafeEqual',
      'toBase64',
      'toHex',
    ]);
  });

  it('re-exports every ./crypto export from the root', () => {
    expect(Object.keys(root).sort()).toEqual(Object.keys(cryptoEntry).sort());
    for (const [name, value] of Object.entries(cryptoEntry)) {
      expect(root[name as keyof typeof root]).toBe(value);
    }
  });
});
