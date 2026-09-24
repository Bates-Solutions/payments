import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { createSquareClient, type SquareClient } from '../client.js';
import { SquareApiError } from '../errors.js';

/**
 * Square can answer 200 with an `errors` body instead of the payload (#137).
 * Every service must throw rather than return empty/default data. These run
 * through the real SDK with `fetch` stubbed, so pager and response shapes are
 * the SDK's own.
 */
const errorsBody = {
  errors: [
    {
      category: 'AUTHENTICATION_ERROR',
      code: 'INSUFFICIENT_SCOPES',
      detail: 'The merchant has not given your application sufficient permissions.',
    },
  ],
};

type Case = [string, (square: SquareClient) => Promise<unknown>];

const cases: Case[] = [
  // catalog
  ['catalog.get', (s) => s.catalog.get('OBJ')],
  ['catalog.delete', (s) => s.catalog.delete('OBJ')],
  ['catalog.list', (s) => s.catalog.list('ITEM')],
  ['catalog.search', (s) => s.catalog.search()],
  ['catalog.batchGet', (s) => s.catalog.batchGet(['OBJ'])],
  ['catalog.createCategory', (s) => s.catalog.createCategory({ name: 'Drinks' })],
  // checkout
  ['checkout.paymentLinks.get', (s) => s.checkout.paymentLinks.get('LINK')],
  ['checkout.paymentLinks.delete', (s) => s.checkout.paymentLinks.delete('LINK')],
  ['checkout.paymentLinks.list', (s) => s.checkout.paymentLinks.list()],
  // customer groups
  ['customerGroups.get', (s) => s.customerGroups.get('GRP')],
  ['customerGroups.delete', (s) => s.customerGroups.delete('GRP')],
  ['customerGroups.list', (s) => s.customerGroups.list()],
  ['customerGroups.addCustomer', (s) => s.customerGroups.addCustomer('GRP', 'CUST')],
  ['customerGroups.removeCustomer', (s) => s.customerGroups.removeCustomer('GRP', 'CUST')],
  // customers
  ['customers.get', (s) => s.customers.get('CUST')],
  ['customers.create', (s) => s.customers.create({ givenName: 'Ada' })],
  ['customers.delete', (s) => s.customers.delete('CUST')],
  ['customers.search', (s) => s.customers.search()],
  ['customers.list', (s) => s.customers.list()],
  // gift cards
  ['giftCards.get', (s) => s.giftCards.get('GC')],
  ['giftCards.list', (s) => s.giftCards.list()],
  ['giftCards.activities.list', (s) => s.giftCards.activities.list()],
  // inventory
  ['inventory.getCounts', (s) => s.inventory.getCounts('VAR')],
  ['inventory.batchGetCounts', (s) => s.inventory.batchGetCounts(['VAR'])],
  ['inventory.adjust', (s) => s.inventory.adjust({ catalogObjectId: 'VAR', quantity: 1 })],
  // invoices
  ['invoices.get', (s) => s.invoices.get('INV')],
  ['invoices.delete', (s) => s.invoices.delete('INV', 1)],
  ['invoices.search', (s) => s.invoices.search()],
  // loyalty
  ['loyalty.getProgram', (s) => s.loyalty.getProgram()],
  ['loyalty.getAccount', (s) => s.loyalty.getAccount('ACCT')],
  // orders
  ['orders.get', (s) => s.orders.get('ORD')],
  ['orders.search', (s) => s.orders.search()],
  // payments
  ['payments.get', (s) => s.payments.get('PAY')],
  ['payments.cancel', (s) => s.payments.cancel('PAY')],
  ['payments.list', (s) => s.payments.list()],
  // subscriptions
  ['subscriptions.get', (s) => s.subscriptions.get('SUB')],
  ['subscriptions.cancel', (s) => s.subscriptions.cancel('SUB')],
  ['subscriptions.search', (s) => s.subscriptions.search()],
  // webhook subscriptions
  ['webhooks.subscriptions.get', (s) => s.webhooks.subscriptions.get('WH')],
  ['webhooks.subscriptions.delete', (s) => s.webhooks.subscriptions.delete('WH')],
  ['webhooks.subscriptions.list', (s) => s.webhooks.subscriptions.list()],
];

describe('200 responses carrying errors (#137)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(errorsBody), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        )
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each(cases)('%s throws SquareApiError instead of returning data', async (_name, call) => {
    const square = createSquareClient({ accessToken: 'test-token', locationId: 'LOC' });

    const error = await call(square).then(
      (value: unknown) => ({ resolved: value }),
      (e: unknown) => e
    );

    expect(error).toBeInstanceOf(SquareApiError);
    expect(error).toMatchObject({ code: 'INSUFFICIENT_SCOPES', statusCode: 200 });
  });
});
