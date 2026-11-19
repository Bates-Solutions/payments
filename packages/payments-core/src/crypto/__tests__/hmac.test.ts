import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { toBase64, toHex } from '../encoding';
import { hmacSha256 } from '../hmac';

describe('hmacSha256', () => {
  // RFC 4231, test cases 1 and 2.
  it('matches RFC 4231 test case 1 (byte key)', async () => {
    const key = new Uint8Array(20).fill(0x0b);
    const digest = await hmacSha256(key, 'Hi There');
    expect(toHex(digest)).toBe('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
  });

  it('matches RFC 4231 test case 2 (string key)', async () => {
    const digest = await hmacSha256('Jefe', 'what do ya want for nothing?');
    expect(toHex(digest)).toBe('5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843');
    expect(toBase64(digest)).toBe('W9zBRr9gdU5qBCQmCJV1x1oAPwidJzmDnexYuWTsOEM=');
  });

  it('returns the raw 32-byte digest', async () => {
    const digest = await hmacSha256('secret', 'payload');
    expect(digest).toBeInstanceOf(Uint8Array);
    expect(digest.length).toBe(32);
  });

  it('treats a string and its UTF-8 bytes the same', async () => {
    const text = 'café ✓ 支付';
    const encoded = new TextEncoder().encode(text);
    expect(await hmacSha256(text, text)).toEqual(await hmacSha256(encoded, encoded));
  });

  it('accepts an empty payload', async () => {
    const digest = await hmacSha256('key', '');
    expect(toHex(digest)).toBe(createHmac('sha256', 'key').update('').digest('hex'));
  });

  // The providers' own helpers produce the hex (stripe, clover) or base64 (squareup)
  // of exactly this digest, so node:crypto is the reference for all three shapes.
  // Tests only: the package source never imports node:*.
  it('matches node:crypto byte for byte over the payload shapes the providers sign', async () => {
    const secret = 'whsec_test_secret';
    const rawBody = JSON.stringify({ id: 'evt_1', data: { amount: 1099, note: 'naïve' } });
    const payloads = [`1730000000.${rawBody}`, `https://example.com/webhooks${rawBody}`, rawBody];
    for (const payload of payloads) {
      const digest = await hmacSha256(secret, payload);
      expect(toHex(digest)).toBe(createHmac('sha256', secret).update(payload).digest('hex'));
      expect(toBase64(digest)).toBe(createHmac('sha256', secret).update(payload).digest('base64'));
    }
  });

  // WebCrypto rejects views over a SharedArrayBuffer, so the bytes are copied first.
  it('accepts a secret and payload backed by a SharedArrayBuffer', async () => {
    const shared = (text: string) => {
      const encoded = new TextEncoder().encode(text);
      const view = new Uint8Array(new SharedArrayBuffer(encoded.length));
      view.set(encoded);
      return view;
    };
    const digest = await hmacSha256(shared('Jefe'), shared('what do ya want for nothing?'));
    expect(toHex(digest)).toBe('5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843');
  });

  it('hashes only the bytes in view, not the rest of the buffer', async () => {
    const buffer = new TextEncoder().encode('xxpayloadxx');
    const view = new Uint8Array(buffer.buffer, 2, 7);
    expect(await hmacSha256('key', view)).toEqual(await hmacSha256('key', 'payload'));
  });

  it('rejects an empty secret, which WebCrypto does not accept as an HMAC key', async () => {
    await expect(hmacSha256('', 'payload')).rejects.toThrow();
  });
});
