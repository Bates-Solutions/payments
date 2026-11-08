// Test settings shared by every package. Each packages/<name>/vitest.config.ts
// re-exports this, so `npm test` inside a package and the root vitest.config.ts
// (which runs every package as a project) use the same settings. Paths resolve
// against the package directory, which is each project's root.
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.ts', 'src/**/index.ts', 'src/**/types.ts'],
    },
  },
});
