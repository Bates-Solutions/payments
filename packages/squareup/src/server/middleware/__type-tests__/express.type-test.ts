/**
 * Compile-only regression guard for issue #128.
 *
 * The Express middleware deliberately declares its own structural stand-in types
 * instead of importing from `express`, so its generated `.d.ts` stays
 * self-contained. The invariant that must survive that decoupling: the handlers
 * remain drop-in for a real Express app. This file imports the *real* `express`
 * types and asserts assignability, so tightening a stand-in in a way that breaks
 * Express compatibility fails `tsc` here.
 *
 * It is type-checked via `tsconfig.type-tests.json` (wired into `npm run
 * typecheck`) and excluded from the published build — it never emits into
 * `dist`. Nothing here runs; the assertions are purely at the type level.
 */
import express, { type Request, type RequestHandler } from 'express';
import {
  createExpressWebhookHandler,
  rawBodyMiddleware,
  type SquareWebhookRequest,
} from '../express.js';

// The produced handler is assignable to Express's RequestHandler…
const handler: RequestHandler = createExpressWebhookHandler({
  signatureKey: 'test',
  handlers: {},
});

// …and so is the raw-body middleware.
const raw: RequestHandler = rawBodyMiddleware;

// Both drop straight into an Express app without a cast.
const app = express();
app.use('/webhook', express.raw({ type: 'application/json' }), raw);
app.post('/webhook', handler);

// Documented recovery path for consumers who need Express's extra Request fields
// on the Square webhook request: intersect with the real Express `Request`.
const augmented = (req: SquareWebhookRequest & Request): void => {
  void req.squareEvent; // from squareup
  void req.rawBody; //     from squareup
  void req.params; //      from express
  void req.query; //       from express
  void req.get('content-type'); // from express
};

// Reference everything so noUnusedLocals is satisfied without runtime effect.
export type _Guard = [typeof handler, typeof raw, typeof app, typeof augmented];
