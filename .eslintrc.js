module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  // parserOptions: {
  //   parser: 'babel-eslint',
  // },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.vue'],
      },
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'padded-blocks': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'always',
      vue: 'never',
    }],
    'import/no-unresolved': ['error',
      { ignore: ['@/'] },
    ],
    'no-param-reassign': 'off',
    'max-classes-per-file': 'off',
    'import/no-named-as-default': 0,
    'import/newline-after-import': ['error', { count: 2 }],
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'object-curly-newline': ['error', {
      ObjectExpression: { minProperties: 6, multiline: true, consistent: true },
      ObjectPattern: { minProperties: 6, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 6, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 6, multiline: true, consistent: true },
    }],
    'prefer-destructuring': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'no-underscore-dangle': 'off',
    camelcase: 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
