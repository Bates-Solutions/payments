// Runs every package's tests in one vitest process: `npx vitest run` from the
// repo root. Each package is a project, configured by its own vitest.config.ts
// (a re-export of vitest.shared.ts). `npm test` at the root instead runs each
// package's own `test` script, one package at a time.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*'],
  },
});
