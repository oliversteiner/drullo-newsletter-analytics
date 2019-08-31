module.exports = {
  parser: 'vue-eslint-parser',

  extends: [
    'plugin:vue/recommended',
  //  '@vue/standard',
  //  '@vue/typescript',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    // indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    'no-extra-semi': "error",
    semi: "off",
    'vue/max-attributes-per-line': [2, {
      'singleline': 20,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }],
  },
};
