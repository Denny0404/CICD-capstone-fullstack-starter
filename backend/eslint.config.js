import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Tell ESLint about Node globals: process, console, module, etc.
      globals: {
        ...globals.node
      }
    },
    rules: {
      // Friendly defaults
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      // Allow intentional empty catch blocks (we use one in db.js cleanup)
      'no-empty': ['error', { 'allowEmptyCatch': true }]
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**'
    ]
  }
];
