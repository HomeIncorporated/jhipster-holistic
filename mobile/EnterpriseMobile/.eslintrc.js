module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  rules: {
    semi: [2, 'never'],
    quotes: [2, 'single', { avoidEscape: true }],
  },
  globals: {
    describe: 'readonly',
    test: 'readonly',
    jest: 'readonly',
    expect: 'readonly',
    fetch: 'readonly',
    navigator: 'readonly',
    __DEV__: 'readonly',
    XMLHttpRequest: 'readonly',
    FormData: 'readonly',
    React$Element: 'readonly',
    before: 'readonly',
    beforeEach: 'readonly',
    by: 'readonly',
    element: 'readonly',
    it: 'readonly',
    device: 'readonly',
    after: 'readonly',
    afterEach: 'readonly',
  },
}