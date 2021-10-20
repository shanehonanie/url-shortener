module.exports = {
  env: {
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
  },
};
