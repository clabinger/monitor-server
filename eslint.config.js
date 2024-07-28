import js from '@eslint/js';
import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  js.configs.recommended,
  stylisticJs.configs['all-flat'],
  {
    languageOptions: { globals: globals.node },
    rules: {
      '@stylistic/js/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/js/array-element-newline': ['error', 'consistent'],
      '@stylistic/js/brace-style': ['error', '1tbs'],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/dot-location': ['error', 'property'],
      '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/padded-blocks': ['error', 'never'],
      '@stylistic/js/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'always'],
      'no-unused-vars': ['error', {
        caughtErrors: 'none',
      }],
    },
  },
];
