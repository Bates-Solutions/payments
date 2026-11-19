import { describe, expect, it } from 'vitest';
import * as cryptoEntry from '../crypto/index';
import * as errorsEntry from '../errors/index';
import * as root from '../index';

describe('entry points', () => {
  it('exports the crypto primitives from ./crypto', () => {
    expect(Object.keys(cryptoEntry).sort()).toEqual([
      'createIdempotencyKey',
      'fromBase64',
      'hmacSha256',
      'parseTimestampedSignatureHeader',
      'timingSafeEqual',
      'toBase64',
      'toHex',
      'verifyTimestampedHmac',
    ]);
  });

  it('exports the error helpers from ./errors', () => {
    expect(Object.keys(errorsEntry).sort()).toEqual(['PaymentsError', 'requireNonEmpty']);
  });

  it('re-exports every entry point export from the root', () => {
    const entries = { ...cryptoEntry, ...errorsEntry };
    expect(Object.keys(root).sort()).toEqual(Object.keys(entries).sort());
    for (const [name, value] of Object.entries(entries)) {
      expect(root[name as keyof typeof root]).toBe(value);
    }
  });
});
