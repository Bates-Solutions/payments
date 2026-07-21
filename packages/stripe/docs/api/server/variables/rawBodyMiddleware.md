[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / rawBodyMiddleware

# Variable: rawBodyMiddleware

> `const` **rawBodyMiddleware**: `RequestHandler`

Defined in: [server/middleware/express.ts:138](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/express.ts#L138)

Raw body parser middleware for Express.

Captures the raw body before JSON parsing for signature verification.

## Example

```typescript
import express from 'express';
import { rawBodyMiddleware } from '@bates-solutions/stripe/server';

const app = express();
app.use('/webhook', rawBodyMiddleware);
```
