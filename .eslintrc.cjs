module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    /** 0 = off, 1 = warn, 2 = error */
    'import/no-cycle': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': ['off'],
    'no-shadow': 'off',
    'import/extensions': 'off',
    'no-unsafe-optional-chaining': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'warn',
    'react/destructuring-assignment': 'warn',
    'react/jsx-filename-extension': [0, {
      extensions: ['.js', '.jsx', '.ts', '.tsx '],
    }],
    'max-len': ['error', {
      code: 125,
    }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'linebreak-style': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
