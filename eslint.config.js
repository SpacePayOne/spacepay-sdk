import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.ts', 'examples/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        fetch: 'readonly',
        RequestInit: 'readonly',
        AbortController: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        require: 'readonly',
        globalThis: 'readonly',
        crypto: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // General rules
      'no-console': 'off', // Allow console.log in examples
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead
      'prefer-template': 'error',
      'no-return-await': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  // Browser-only files: add DOM/window globals (replaces deprecated /* eslint-env browser */)
  {
    files: [
      'src/frontend-embedded-button.ts',
      'src/frontend-embedded-checkout.ts',
      'src/frontend-embedded-wallet.ts',
      'src/frontend-modal.ts',
      'src/utils/url.ts',
    ],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        URL: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLIFrameElement: 'readonly',
        Element: 'readonly',
        MessageEvent: 'readonly',
        Event: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.js', '*.mjs', '*.cjs'],
  },
]
