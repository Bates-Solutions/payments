import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { CheckoutService } from '../services/checkout.service.js';
import { InvoicesService } from '../services/invoices.service.js';
import { PaymentLinksService } from '../services/payment-links.service.js';
import { StripeApiError, StripeValidationError } from '../errors.js';
import { listAll, toRangeParam, toUnixTime } from '../utils.js';
import { createStripeClient } from '../client.js';

/** Fake `listLineItems` that serves `items` in pages of `pageSize`. */
function pagedList(items: { id: string }[], pageSize: number) {
  return vi.fn((_id: string, params: { starting_after?: string }) => {
    const start = params.starting_after
      ? items.findIndex((item) => item.id === params.starting_after) + 1
      : 0;
    const data = items.slice(start, start + pageSize);
    return Promise.resolve({ data, has_more: start + pageSize < items.length });
  });
}

const items = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `li_${String(i)}` }));

function stripeWith(resources: Record<string, unknown>): Stripe {
  return resources as unknown as Stripe;
}

describe('toUnixTime / toRangeParam', () => {
  it('converts a Date to whole Unix seconds and passes numbers through', () => {
    expect(toUnixTime(new Date('2026-03-01T00:00:00.999Z'))).toBe(1772323200);
    expect(toUnixTime(1772323200)).toBe(1772323200);
  });

  it('rejects invalid dates and non-finite numbers', () => {
    expect(() => toUnixTime(new Date('nope'))).toThrow(StripeValidationError);
    expect(() => toUnixTime(Number.POSITIVE_INFINITY)).toThrow(StripeValidationError);
    expect(() => toUnixTime('1' as unknown as number)).toThrow(StripeValidationError);
  });

  it('rejects fractional seconds', () => {
    expect(() => toUnixTime(1772323200.5)).toThrow(StripeValidationError);
  });

  it('rejects values that look like milliseconds, but accepts the boundary', () => {
    expect(() => toUnixTime(1772323200000)).toThrow(/looks like milliseconds/);
    expect(() => toUnixTime(1e11 + 1)).toThrow(/looks like milliseconds/);
    expect(toUnixTime(1e11)).toBe(1e11);
  });

  it('reports the given field name', () => {
    expect(() => toUnixTime(1.5, 'created.gte')).toThrow(
      expect.objectContaining({
        field: 'created.gte',
        message: expect.stringContaining('created.gte'),
      })
    );
    expect(() => toUnixTime(Number.NaN)).toThrow(expect.objectContaining({ field: 'value' }));
    expect(() => toRangeParam({ lt: 1772323200000 }, 'created')).toThrow(
      expect.objectContaining({ field: 'created.lt' })
    );
    expect(() => toRangeParam({ gt: 0.5 }, 'created')).toThrow(
      expect.objectContaining({ field: 'created.gt' })
    );
  });

  it('maps every bound of a range', () => {
    expect(
      toRangeParam(
        {
          gte: new Date('2026-03-01T00:00:00Z'),
          gt: 1,
          lte: 2,
          lt: new Date('2026-04-01T00:00:00Z'),
        },
        'created'
      )
    ).toEqual({ gte: 1772323200, gt: 1, lte: 2, lt: 1775001600 });
    expect(toRangeParam({ gte: 5 }, 'created')).toEqual({
      gte: 5,
      gt: undefined,
      lte: undefined,
      lt: undefined,
    });
    expect(toRangeParam(undefined, 'created')).toBeUndefined();
  });
});

describe('listAll', () => {
  it('follows the cursor until has_more is false', async () => {
    const fetchPage = vi.fn((after: string | undefined) =>
      Promise.resolve(
        after === undefined
          ? { data: [{ id: 'a' }, { id: 'b' }], has_more: true }
          : { data: [{ id: 'c' }], has_more: false }
      )
    );
    expect(await listAll(fetchPage)).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    expect(fetchPage.mock.calls).toEqual([[undefined], ['b']]);
  });

  it('stops on an empty page even if has_more is true', async () => {
    const fetchPage = vi.fn(() => Promise.resolve({ data: [], has_more: true }));
    expect(await listAll(fetchPage)).toEqual([]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });
});

describe('CheckoutService line items', () => {
  it('listLineItems fetches every page', async () => {
    const listLineItems = pagedList(items(250), 100);
    const service = new CheckoutService(stripeWith({ checkout: { sessions: { listLineItems } } }));

    const result = await service.listLineItems('cs_1');

    expect(result).toHaveLength(250);
    expect(result.at(-1)?.id).toBe('li_249');
    expect(listLineItems).toHaveBeenCalledTimes(3);
    expect(listLineItems).toHaveBeenNthCalledWith(1, 'cs_1', {
      limit: 100,
      starting_after: undefined,
      expand: undefined,
    });
    expect(listLineItems).toHaveBeenNthCalledWith(
      2,
      'cs_1',
      expect.objectContaining({
        starting_after: 'li_99',
      })
    );
  });

  it('listLineItems can expand the product', async () => {
    const listLineItems = pagedList(items(1), 100);
    const service = new CheckoutService(stripeWith({ checkout: { sessions: { listLineItems } } }));
    await service.listLineItems('cs_1', { expandProduct: true });
    expect(listLineItems).toHaveBeenCalledWith(
      'cs_1',
      expect.objectContaining({ expand: ['data.price.product'] })
    );
  });

  it('listLineItems validates and normalizes errors', async () => {
    const listLineItems = vi
      .fn()
      .mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 });
    const service = new CheckoutService(stripeWith({ checkout: { sessions: { listLineItems } } }));
    await expect(service.listLineItems('')).rejects.toMatchObject({ field: 'sessionId' });
    expect(listLineItems).not.toHaveBeenCalled();
    await expect(service.listLineItems('cs_x')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('list filters by status, created range and payment link, and expands line items', async () => {
    const list = vi.fn().mockResolvedValue({ data: [], has_more: false });
    const service = new CheckoutService(stripeWith({ checkout: { sessions: { list } } }));

    await service.list({
      status: 'complete',
      paymentLinkId: 'plink_1',
      created: { gte: new Date('2026-03-01T00:00:00Z'), lt: 1775001600 },
      expandLineItems: true,
    });

    expect(list).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'complete',
        payment_link: 'plink_1',
        created: { gte: 1772323200, gt: undefined, lte: undefined, lt: 1775001600 },
        expand: ['data.line_items'],
      })
    );
  });

  it('list sends no new filters by default', async () => {
    const list = vi.fn().mockResolvedValue({ data: [], has_more: false });
    await new CheckoutService(stripeWith({ checkout: { sessions: { list } } })).list();
    const params = list.mock.calls[0][0] as Record<string, unknown>;
    expect(params.created).toBeUndefined();
    expect(params.expand).toBeUndefined();
    expect(params.status).toBeUndefined();
  });
});

describe('InvoicesService lines', () => {
  it('listLines fetches every page', async () => {
    const listLineItems = pagedList(items(101), 100);
    const service = new InvoicesService(stripeWith({ invoices: { listLineItems } }));

    const result = await service.listLines('in_1');

    expect(result).toHaveLength(101);
    expect(listLineItems).toHaveBeenCalledTimes(2);
    expect(listLineItems).toHaveBeenNthCalledWith(1, 'in_1', {
      limit: 100,
      starting_after: undefined,
    });
  });

  it('listLines validates and normalizes errors', async () => {
    const listLineItems = vi.fn().mockRejectedValue({ type: 'api_error', statusCode: 500 });
    const service = new InvoicesService(stripeWith({ invoices: { listLineItems } }));
    await expect(service.listLines('')).rejects.toMatchObject({ field: 'invoiceId' });
    await expect(service.listLines('in_1')).rejects.toThrow(StripeApiError);
  });

  it('list filters by status and created range', async () => {
    const list = vi.fn().mockResolvedValue({ data: [], has_more: false });
    const service = new InvoicesService(stripeWith({ invoices: { list } }));
    await service.list({ status: 'paid', created: { gt: 10, lte: 20 } });
    expect(list).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'paid',
        created: { gt: 10, gte: undefined, lt: undefined, lte: 20 },
      })
    );
  });

  it('list rejects an invalid date before calling Stripe', async () => {
    const list = vi.fn();
    const service = new InvoicesService(stripeWith({ invoices: { list } }));
    await expect(service.list({ created: { gte: new Date('x') } })).rejects.toThrow(
      expect.objectContaining({ field: 'created.gte' })
    );
    expect(list).not.toHaveBeenCalled();
  });
});

describe('PaymentLinksService', () => {
  it('retrieves a payment link', async () => {
    const retrieve = vi.fn().mockResolvedValue({ id: 'plink_1' });
    const service = new PaymentLinksService(stripeWith({ paymentLinks: { retrieve } }));
    expect((await service.get('plink_1')).id).toBe('plink_1');
    expect(retrieve).toHaveBeenCalledWith('plink_1');
  });

  it('get normalizes errors', async () => {
    const retrieve = vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 });
    const service = new PaymentLinksService(stripeWith({ paymentLinks: { retrieve } }));
    await expect(service.get('plink_x')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('listLineItems fetches every page and can expand the product', async () => {
    const listLineItems = pagedList(items(3), 2);
    const service = new PaymentLinksService(stripeWith({ paymentLinks: { listLineItems } }));
    const result = await service.listLineItems('plink_1', { expandProduct: true });
    expect(result).toHaveLength(3);
    expect(listLineItems).toHaveBeenNthCalledWith(1, 'plink_1', {
      limit: 100,
      starting_after: undefined,
      expand: ['data.price.product'],
    });
  });

  it('listLineItems validates and normalizes errors', async () => {
    const listLineItems = vi.fn().mockRejectedValue({ type: 'api_error', statusCode: 500 });
    const service = new PaymentLinksService(stripeWith({ paymentLinks: { listLineItems } }));
    await expect(service.listLineItems('')).rejects.toMatchObject({ field: 'paymentLinkId' });
    await expect(service.listLineItems('plink_1')).rejects.toThrow(StripeApiError);
  });

  it('is wired into the client', () => {
    expect(createStripeClient({ apiKey: 'sk_test_1' }).paymentLinks).toBeInstanceOf(
      PaymentLinksService
    );
  });
});
