module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:json/recommended',
    'google',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    }
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'import/no-cycle': ['error', { maxDepth: 1 }],
    'require-jsdoc': [0],
    'no-console': 'error',
    'no-debugger': 'error',
    'new-cap': 'off'
  }
};
