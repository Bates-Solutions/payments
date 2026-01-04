import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/react/__tests__/**/*.{test,spec}.ts', 'src/react/__tests__/**/*.{test,spec}.tsx'],
    setupFiles: ['src/react/__tests__/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/react/**/*.ts', 'src/react/**/*.tsx'],
      exclude: [
        'src/react/__tests__/**',
        'src/react/**/index.ts',
        'src/react/**/types.ts',
      ],
    },
  },
});
