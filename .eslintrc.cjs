const {
  resolve
} = require('node:path');

module.exports = {
  root: true,

  parser: 'vue-eslint-parser',
  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended', 'prettier'],

  plugins: ['@typescript-eslint', 'vue'],

  // globals: {
  //   ga: 'readonly', // Google Analytics
  //   cordova: 'readonly',
  //   __statics: 'readonly',
  //   __QUASAR_SSR__: 'readonly',
  //   __QUASAR_SSR_SERVER__: 'readonly',
  //   __QUASAR_SSR_CLIENT__: 'readonly',
  //   __QUASAR_SSR_PWA__: 'readonly',
  //   process: 'readonly',
  //   Capacitor: 'readonly',
  //   chrome: 'readonly',
  // },
  // add your custom rules here
  rules: {
    'vue/multi-word-component-names': 'off',
    'prefer-promise-reject-errors': 'off',
    quotes: ['warn', 'single', {
      avoidEscape: true
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION', // e.g. 'is', 'v-is'
          'CONDITIONALS', // e.g. 'v-if', 'v-else-if', 'v-else', 'v-show'
          'LIST_RENDERING', // e.g. 'v-for item in items'
          'RENDER_MODIFIERS', // e.g. 'v-once', 'v-pre'
          'GLOBAL', //  e.g. 'id'
          ['UNIQUE', 'SLOT'], //  e.g. 'ref', 'key' ,'v-slot', 'slot'.
          'TWO_WAY_BINDING', // e.g. 'v-model'
          'OTHER_DIRECTIVES', // e.g. 'v-custom-directive'
          'OTHER_ATTR',
          'EVENTS', // e.g. '@click="functionCall"', 'v-on="event"'
          'CONTENT', // e.g. 'v-text', 'v-html'
        ],
        alphabetical: false, // 按照字母順序
      },
    ],
  },
};
