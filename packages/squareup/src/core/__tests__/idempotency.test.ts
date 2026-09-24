import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { createSquareClient, type SquareClient } from '../client.js';
import { deriveIdempotencyKey } from '../utils.js';

/**
 * A caller's `idempotencyKey` must reach every Square call a method makes, so
 * a retry after a network failure or timeout is deduplicated (#149). Runs
 * through the real SDK with `fetch` stubbed and inspects the wire bodies.
 */
function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

function sentKeys(): unknown[] {
  return fetchMock.mock.calls.map(([, init]) => {
    const body = JSON.parse((init as RequestInit).body as string) as { idempotency_key?: unknown };
    return body.idempotency_key;
  });
}

function square(): SquareClient {
  return createSquareClient({ accessToken: 'test-token', locationId: 'LOC' });
}

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('single-call methods pass the caller key through', () => {
  it.each<[string, unknown, (s: SquareClient) => Promise<unknown>]>([
    ['orders.update', { order: { id: 'O1' } }, (s) => s.orders.update('O1', { version: 1, idempotencyKey: 'KEY' })],
    ['orders.pay', { order: { id: 'O1' } }, (s) => s.orders.pay('O1', ['P1'], { idempotencyKey: 'KEY' })],
    ['invoices.publish', { invoice: { id: 'I1' } }, (s) => s.invoices.publish('I1', 1, { idempotencyKey: 'KEY' })],
    [
      'invoices.update',
      { invoice: { id: 'I1' } },
      (s) => s.invoices.update('I1', 1, { title: 'T', idempotencyKey: 'KEY' }),
    ],
  ])('%s', async (_name, body, call) => {
    fetchMock.mockResolvedValue(jsonResponse(body));

    await call(square());

    expect(sentKeys()).toEqual(['KEY']);
  });

  it('still generates a key when none is passed', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ order: { id: 'O1' } }));

    await square().orders.pay('O1', ['P1']);

    expect(sentKeys()[0]).toEqual(expect.any(String));
  });
});

describe('two-call methods cover both calls with one caller key', () => {
  function invoiceFlow() {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ order: { id: 'O1' } }))
      .mockResolvedValueOnce(jsonResponse({ invoice: { id: 'I1' } }));
  }

  function rewardFlow() {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ reward: { id: 'R1' } }))
      .mockResolvedValueOnce(jsonResponse({ event: { id: 'E1' } }));
  }

  const createInvoice = (s: SquareClient, idempotencyKey?: string) =>
    s.invoices.create({ customerId: 'C', lineItems: [{ name: 'Item', quantity: 1, amount: 100 }], idempotencyKey });

  it('invoices.create derives the order key from the caller key', async () => {
    invoiceFlow();

    await createInvoice(square(), 'KEY');

    expect(sentKeys()).toEqual(['KEY:order', 'KEY']);
  });

  it('loyalty.redeemReward derives the redeem key from the caller key', async () => {
    rewardFlow();

    await square().loyalty.redeemReward('ACCT', 'TIER', undefined, 'KEY');

    expect(sentKeys()).toEqual(['KEY', 'KEY:redeem']);
  });

  it.each<[string, () => void, (s: SquareClient) => Promise<unknown>]>([
    ['invoices.create', invoiceFlow, (s) => createInvoice(s)],
    ['loyalty.redeemReward', rewardFlow, (s) => s.loyalty.redeemReward('ACCT', 'TIER')],
  ])('%s links both keys when no key is passed', async (_name, flow, call) => {
    flow();

    await call(square());

    const [first, second] = sentKeys() as [string, string];
    expect(first).not.toBe(second);
    expect([first, second].some((k) => k.endsWith(':order') || k.endsWith(':redeem'))).toBe(true);
  });

  it('sends identical keys on a retry with the same caller key', async () => {
    invoiceFlow();
    await createInvoice(square(), 'RETRY');
    invoiceFlow();
    await createInvoice(square(), 'RETRY');

    const keys = sentKeys();
    expect(keys.slice(0, 2)).toEqual(keys.slice(2, 4));
  });
});

describe('deriveIdempotencyKey', () => {
  it('suffixes the step when it fits', () => {
    expect(deriveIdempotencyKey('abc', 'order')).toBe('abc:order');
  });

  it('hashes to 64 hex chars when the suffixed key would exceed 128 chars', () => {
    const long = 'k'.repeat(125);

    const derived = deriveIdempotencyKey(long, 'redeem');

    expect(derived).toMatch(/^[0-9a-f]{64}$/);
    expect(deriveIdempotencyKey(long, 'redeem')).toBe(derived);
    expect(deriveIdempotencyKey(long, 'order')).not.toBe(derived);
  });
});
