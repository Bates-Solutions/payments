import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    exclude: [
      'src/angular/**/*.{test,spec}.ts', // Angular requires jsdom and special setup
      'src/react/**/*.{test,spec}.ts', // React requires jsdom and special setup
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.{test,spec}.ts',
        'src/**/index.ts',
        'src/**/types.ts',
        'src/angular/**', // Angular requires jsdom and special setup
        'src/react/**', // React requires jsdom and special setup
      ],
    },
  },
});
