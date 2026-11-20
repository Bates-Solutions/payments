import { describe, it, expect } from 'vitest';
import { getAccountId } from '../webhook.js';
import type { WebhookEvent } from '../types.js';

function event(fields: Record<string, unknown>): WebhookEvent {
  return {
    id: 'evt_1',
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_1' } },
    ...fields,
  } as unknown as WebhookEvent;
}

describe('getAccountId', () => {
  it('returns the connected account of a Connect event', () => {
    expect(getAccountId(event({ account: 'acct_1' }))).toBe('acct_1');
  });

  it('returns undefined for platform events', () => {
    expect(getAccountId(event({}))).toBeUndefined();
    expect(getAccountId(event({ account: null }))).toBeUndefined();
  });
});
