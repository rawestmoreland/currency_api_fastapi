module.exports = {
  extends: ['airbnb', 'prettier', 'next/core-web-vitals'],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['!next.config.js'] }],
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'max-depth': ['warn', 10],
    'max-nested-callbacks': ['warn', 4],
    'max-statements': ['warn', 30],
    'no-console': 'warn',
    'no-use-before-define': ['error', 'nofunc'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', next: 'export', prev: '*' },
      { blankLine: 'any', next: 'export', prev: 'const' },
    ],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx', '.tsx'],
      },
    ],
    'react/jsx-fragments': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unknown-property': [
      2,
      {
        ignore: ['global', 'jsx'],
      },
    ],
    'react/prop-types': ['error'],
    'react/require-default-props': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@/*', './src/*']],
        extensions: ['.js', '.jsx'],
      },
      jsconfig: {
        config: 'jsconfig.json',
      },
      node: {
        paths: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
