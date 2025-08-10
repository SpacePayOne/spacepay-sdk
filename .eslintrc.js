module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', '@typescript-eslint/recommended'],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // General rules
    'no-console': 'off', // Allow console.log in examples
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',

    // Disable rules that conflict with Prettier
    indent: 'off',
    quotes: 'off',
    semi: 'off',
    'comma-dangle': 'off',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js', // Ignore compiled JS files
  ],
}
