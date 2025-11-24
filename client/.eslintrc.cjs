module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true,
    jest: true,
  },
  extends: [
    '@react-native/eslint-config',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-native', 'react-hooks', '@typescript-eslint', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    },
  },
  ignorePatterns: ['node_modules/**', 'dist/**', 'build/**', '*.cjs'],
};
