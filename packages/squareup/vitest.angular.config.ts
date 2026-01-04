import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/angular/**/*.{test,spec}.ts'],
    setupFiles: ['src/angular/__tests__/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    // Use threads pool for consistent behavior across Node versions
    pool: 'threads',
    deps: {
      optimizer: {
        web: {
          include: [/@angular/],
        },
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/angular/**/*.ts'],
      exclude: [
        'src/angular/**/*.{test,spec}.ts',
        'src/angular/**/index.ts',
        'src/angular/**/types.ts',
        'src/angular/__tests__/setup.ts',
      ],
    },
  },
});
