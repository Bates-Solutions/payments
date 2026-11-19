import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifySignatureAsync } from '../webcrypto.js';
import { verifySignature } from '../webhook.js';

// Node oracle (independent of the code under test)
function nodeSignature(body: string, key: string, url?: string): string {
  return createHmac('sha256', key)
    .update(url ? url + body : body)
    .digest('base64');
}

// WebCrypto-only signer, as an edge caller would compute it
async function webCryptoSignature(body: string, key: string, url?: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode((url ?? '') + body));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

const KEY = 'test-signature-key';
const URL_ = 'https://example.com/webhook';
const BODY = JSON.stringify({
  event_id: 'evt_123',
  merchant_id: 'M123',
  type: 'payment.created',
  created_at: '2025-01-03T00:00:00Z',
  data: { type: 'payment', id: 'PAY_123', object: { payment: { id: 'PAY_123' } } },
});

describe('verifySignatureAsync', () => {
  it('returns a promise', () => {
    expect(verifySignatureAsync(BODY, nodeSignature(BODY, KEY), KEY)).toBeInstanceOf(Promise);
  });

  it('accepts a valid signature without a notification URL', async () => {
    expect(await verifySignatureAsync(BODY, nodeSignature(BODY, KEY), KEY)).toEqual({
      valid: true,
    });
  });

  it('accepts a valid signature with a notification URL', async () => {
    expect(await verifySignatureAsync(BODY, nodeSignature(BODY, KEY, URL_), KEY, URL_)).toEqual({
      valid: true,
    });
  });

  it('accepts a signature computed purely with WebCrypto', async () => {
    const signature = await webCryptoSignature(BODY, KEY, URL_);
    expect(signature).toBe(nodeSignature(BODY, KEY, URL_));
    expect(await verifySignatureAsync(BODY, signature, KEY, URL_)).toEqual({ valid: true });
  });

  it('rejects a body-only signature when a notification URL is given', async () => {
    expect(await verifySignatureAsync(BODY, nodeSignature(BODY, KEY), KEY, URL_)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('rejects a URL signature when no notification URL is given', async () => {
    expect(await verifySignatureAsync(BODY, nodeSignature(BODY, KEY, URL_), KEY)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('rejects a signature made with a different key', async () => {
    expect(await verifySignatureAsync(BODY, nodeSignature(BODY, 'other-key'), KEY)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('rejects a signature for a tampered body', async () => {
    expect(await verifySignatureAsync(BODY + ' ', nodeSignature(BODY, KEY), KEY)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('rejects an equal-length signature differing only in the first character', async () => {
    const signature = nodeSignature(BODY, KEY);
    const tampered = (signature[0] === 'A' ? 'B' : 'A') + signature.slice(1);
    expect(await verifySignatureAsync(BODY, tampered, KEY)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('rejects an equal-length signature differing only in the last data character', async () => {
    const signature = nodeSignature(BODY, KEY);
    // Base64 of 32 bytes ends in '=', so flip the character before it.
    const tampered = signature.slice(0, -2) + (signature.at(-2) === 'A' ? 'B' : 'A') + '=';
    expect(tampered).toHaveLength(signature.length);
    expect(await verifySignatureAsync(BODY, tampered, KEY)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('rejects a shorter signature', async () => {
    expect(await verifySignatureAsync(BODY, btoa('short'), KEY)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('rejects a non-string signature', async () => {
    expect(await verifySignatureAsync(BODY, { invalid: true } as unknown as string, KEY)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it.each([
    ['', 'sig', KEY, 'Missing request body'],
    [BODY, '', KEY, 'Missing signature header'],
    [BODY, 'sig', '', 'Missing signature key'],
  ])('reports missing input (%#)', async (body, sig, key, error) => {
    expect(await verifySignatureAsync(body, sig, key)).toEqual({ valid: false, error });
  });

  it('returns the WebCrypto error message when crypto.subtle fails', async () => {
    const spy = vi
      .spyOn(globalThis.crypto.subtle, 'importKey')
      .mockRejectedValueOnce(new Error('subtle unavailable'));
    try {
      expect(await verifySignatureAsync(BODY, nodeSignature(BODY, KEY), KEY)).toEqual({
        valid: false,
        error: 'subtle unavailable',
      });
    } finally {
      spy.mockRestore();
    }
  });

  it('falls back to a generic message when crypto.subtle rejects with a non-Error', async () => {
    const spy = vi.spyOn(globalThis.crypto.subtle, 'sign').mockRejectedValueOnce('nope');
    try {
      expect(await verifySignatureAsync(BODY, nodeSignature(BODY, KEY), KEY)).toEqual({
        valid: false,
        error: 'Signature verification failed',
      });
    } finally {
      spy.mockRestore();
    }
  });

  it('handles non-ASCII bodies and keys as UTF-8', async () => {
    const body = JSON.stringify({ note: 'café ☕' });
    const key = 'clé';
    expect(await verifySignatureAsync(body, nodeSignature(body, key), key)).toEqual({
      valid: true,
    });
  });

  it('agrees with the synchronous verifySignature on valid and invalid inputs', async () => {
    const cases: Array<[string, string, string, string | undefined]> = [
      [BODY, nodeSignature(BODY, KEY), KEY, undefined],
      [BODY, nodeSignature(BODY, KEY, URL_), KEY, URL_],
      [BODY, nodeSignature(BODY, KEY), KEY, URL_],
      [BODY, nodeSignature(BODY, 'other'), KEY, undefined],
      [BODY, 'wrong-signature', KEY, undefined],
      ['', 'sig', KEY, undefined],
      [BODY, '', KEY, undefined],
      [BODY, 'sig', '', undefined],
    ];
    for (const [body, sig, key, url] of cases) {
      expect(await verifySignatureAsync(body, sig, key, url)).toEqual(
        verifySignature(body, sig, key, url)
      );
    }
  });
});

// verifySignature decodes the header with Buffer and compares bytes, so it
// accepts non-canonical spellings of a valid signature. The async path decodes
// with payments-core's fromBase64 and must accept and reject exactly the same
// headers.
describe('verifySignature and verifySignatureAsync agree', () => {
  const canonical = nodeSignature(BODY, KEY, URL_);
  const flipLastBits = (sig: string) => {
    // A 32-byte digest is 43 base64 characters plus '='; the 43rd carries two
    // bits that are not part of any byte. Changing only those keeps the bytes.
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const index = alphabet.indexOf(sig.charAt(42));
    return sig.slice(0, 42) + alphabet.charAt(index ^ 1) + sig.slice(43);
  };

  const variants: [string, string][] = [
    ['the canonical signature', canonical],
    ['no padding', canonical.replace(/=+$/, '')],
    ['non-zero trailing bits', flipLastBits(canonical)],
    ['the URL-safe alphabet', canonical.replace(/\+/g, '-').replace(/\//g, '_')],
    ['surrounding whitespace', ` ${canonical}\n`],
    ['characters outside the alphabet', `${canonical.slice(0, 10)}!${canonical.slice(10)}`],
    ['text after the padding', `${canonical}AAAA`],
    ['one byte short', nodeSignature(BODY, KEY, URL_).slice(0, 40)],
    ['a different signature', nodeSignature(BODY, 'other-key', URL_)],
    ['an empty decode', '!!!!'],
    [
      'the hex encoding',
      createHmac('sha256', KEY)
        .update(URL_ + BODY)
        .digest('hex'),
    ],
  ];

  it.each(variants)('gives the same result for %s', async (_, signature) => {
    const sync = verifySignature(BODY, signature, KEY, URL_);
    const async = await verifySignatureAsync(BODY, signature, KEY, URL_);
    expect(async).toEqual(sync);
  });

  it('accepts a non-canonical base64 spelling of a valid signature', async () => {
    const unpadded = canonical.replace(/=+$/, '');
    expect(unpadded).not.toBe(canonical);
    expect(await verifySignatureAsync(BODY, unpadded, KEY, URL_)).toEqual({ valid: true });
    expect(await verifySignatureAsync(BODY, flipLastBits(canonical), KEY, URL_)).toEqual({
      valid: true,
    });
  });

  it('still rejects a signature for another body', async () => {
    expect(await verifySignatureAsync(`${BODY} `, canonical, KEY, URL_)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });
});
