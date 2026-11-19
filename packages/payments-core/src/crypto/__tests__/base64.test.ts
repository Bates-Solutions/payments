import { describe, expect, it } from 'vitest';
import { fromBase64 } from '../base64';
import { toBase64 } from '../encoding';

const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString('hex');

describe('fromBase64', () => {
  it.each([
    ['', ''],
    ['Zg==', 'f'],
    ['Zm8=', 'fo'],
    ['Zm9v', 'foo'],
    ['Zm9vYmFy', 'foobar'],
  ])('decodes the RFC 4648 vector %j', (input, expected) => {
    expect(new TextDecoder().decode(fromBase64(input))).toBe(expected);
  });

  it('round-trips every byte value with toBase64', () => {
    const all = Uint8Array.from({ length: 256 }, (_, i) => i);
    expect(fromBase64(toBase64(all))).toEqual(all);
  });

  it('accepts missing padding', () => {
    expect(fromBase64('Zm8')).toEqual(fromBase64('Zm8='));
    expect(fromBase64('Zg')).toEqual(fromBase64('Zg=='));
  });

  it('drops leftover bits, so non-zero trailing bits decode the same', () => {
    // 'Zm8=' and 'Zm9=' differ only in the two bits that do not make a byte.
    expect(fromBase64('Zm9=')).toEqual(fromBase64('Zm8='));
  });

  it('reads the URL-safe alphabet like the standard one', () => {
    expect(fromBase64('-_8')).toEqual(fromBase64('+/8='));
  });

  it('skips whitespace and other characters outside the alphabet', () => {
    expect(fromBase64(' Zm9v\nYm!Fy ')).toEqual(fromBase64('Zm9vYmFy'));
  });

  it('stops at the first =', () => {
    expect(fromBase64('Zm8=Zm9v')).toEqual(fromBase64('Zm8='));
  });

  it('decodes text with no base64 characters to no bytes', () => {
    expect(fromBase64('!!!')).toEqual(new Uint8Array(0));
  });

  // The point of the leniency: decode exactly what Node's Buffer decodes, so a
  // WebCrypto check agrees with a node:crypto one. Tests only use Buffer.
  it('matches Buffer.from(text, "base64") on random input', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-_= !.\né';
    let seed = 42;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2 ** 31;
      return seed / 2 ** 31;
    };
    for (let n = 0; n < 5000; n++) {
      let text = '';
      const length = Math.floor(random() * 16);
      for (let i = 0; i < length; i++) text += chars[Math.floor(random() * chars.length)];
      expect(hex(fromBase64(text)), JSON.stringify(text)).toBe(
        Buffer.from(text, 'base64').toString('hex')
      );
    }
  });
});
