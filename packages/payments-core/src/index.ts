/**
 * Edge-safe primitives shared by `@bates-solutions/squareup`,
 * `@bates-solutions/stripe` and `@bates-solutions/clover`. Everything here runs
 * on Node 22+, Deno, Bun and Workers: no `node:*` imports, `Buffer` or
 * `process`. Each area is also its own entry point (`./crypto`).
 *
 * @module
 */
export * from './crypto/index.js';
