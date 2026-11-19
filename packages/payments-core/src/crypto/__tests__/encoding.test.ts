import { describe, expect, it } from 'vitest';
import { toBase64, toHex } from '../encoding';

const bytes = (...values: number[]) => new Uint8Array(values);

describe('toHex', () => {
  it('pads each byte to two lowercase characters', () => {
    expect(toHex(bytes(0, 1, 15, 16, 171, 255))).toBe('00010f10abff');
  });

  it('accepts an ArrayBuffer', () => {
    expect(toHex(bytes(222, 173, 190, 239).buffer)).toBe('deadbeef');
  });

  it('returns an empty string for no bytes', () => {
    expect(toHex(bytes())).toBe('');
  });

  it('encodes only the view, not the whole underlying buffer', () => {
    const view = new Uint8Array(bytes(1, 2, 3, 4).buffer, 1, 2);
    expect(toHex(view)).toBe('0203');
  });
});

describe('toBase64', () => {
  it.each([
    ['', ''],
    ['f', 'Zg=='],
    ['fo', 'Zm8='],
    ['foo', 'Zm9v'],
    ['foobar', 'Zm9vYmFy'],
  ])('encodes %j as the RFC 4648 vector %j', (input, expected) => {
    expect(toBase64(new TextEncoder().encode(input))).toBe(expected);
  });

  it('uses the standard alphabet with + and /', () => {
    expect(toBase64(bytes(251, 255, 191))).toBe('+/+/');
  });

  it('encodes every byte value, including those above 127', () => {
    const all = Uint8Array.from({ length: 256 }, (_, i) => i);
    const decoded = Uint8Array.from(atob(toBase64(all)), (c) => c.charCodeAt(0));
    expect(decoded).toEqual(all);
  });

  it('accepts an ArrayBuffer', () => {
    expect(toBase64(new TextEncoder().encode('hi').buffer)).toBe('aGk=');
  });
});
