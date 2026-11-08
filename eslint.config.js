// One flat config for every package. ESLint 10 looks for the config starting
// from each linted file's directory, so `npm run lint` inside packages/<name>
// (which runs `eslint src`) finds this file. The typescript-eslint project
// service picks the nearest tsconfig.json for each file, so every package is
// type-checked against its own tsconfig.
//
// Hoisting puts every package's dependencies in the root node_modules, so an
// undeclared import (clover importing stripe, or one provider importing another
// through its workspace symlink) still resolves and type-checks.
// import-x/no-extraneous-dependencies checks each import against the nearest
// package.json, which is the package's own. devDependencies count only in tests
// and config files. Type-only imports (the express types in the middleware) are
// not checked.
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import { existsSync } from 'node:fs';
import { isBuiltin } from 'node:module';
import path from 'node:path';
import tseslint from 'typescript-eslint';

// The rule skips any import it cannot resolve, and a normal resolver cannot
// resolve a workspace package before it is built (its exports point at dist/),
// or it follows the symlink out of node_modules and the import stops counting as
// external. This resolver only finds the imported package's directory under the
// nearest node_modules, which is all the rule needs to read the package name.
const packageDirResolver = {
  interfaceVersion: 3,
  name: 'package-dir',
  resolve(source, file) {
    if (isBuiltin(source)) return { found: true, path: null };
    if (source.startsWith('.') || path.isAbsolute(source)) return { found: false };
    const parts = source.split('/');
    const name = source.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
    for (let dir = path.dirname(file); ; dir = path.dirname(dir)) {
      const pkg = path.join(dir, 'node_modules', name, 'package.json');
      if (existsSync(pkg)) return { found: true, path: pkg };
      if (path.dirname(dir) === dir) return { found: false };
    }
  },
};

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/docs/**',
      '**/*.config.js',
      '**/*.config.ts',
      'vitest.shared.ts',
      '**/__tests__/**',
      '**/__type-tests__/**',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  prettierConfig,
  {
    plugins: { 'import-x': importX },
    settings: { 'import-x/resolver-next': [packageDirResolver] },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/__tests__/**',
            '**/__type-tests__/**',
            '**/*.test.ts',
            '**/*.config.{js,ts}',
            '**/vitest.shared.ts',
          ],
          peerDependencies: true,
          optionalDependencies: false,
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  }
);
