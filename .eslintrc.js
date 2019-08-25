module.exports = {
  // Specifies the ESLint parser
  parser: '@typescript-eslint/parser',

  extends: [
    'plugin:vue/base',
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript',
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },

  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
  }
}

