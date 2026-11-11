[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / rawBodyMiddleware

# Variable: rawBodyMiddleware

> `const` **rawBodyMiddleware**: `RequestHandler`

Defined in: [server/middleware/express.ts:138](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/middleware/express.ts#L138)

Raw body parser middleware for Express.

Captures the raw body before JSON parsing for signature verification.

## Example

```typescript
import express from 'express';
import { rawBodyMiddleware } from '@bates-solutions/stripe/server';

const app = express();
app.use('/webhook', rawBodyMiddleware);
```
