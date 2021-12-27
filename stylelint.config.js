module.exports = {
  extends: '@fatesigner/stylelint-config',
  rules: {
    'no-descending-specificity': null,
    'property-no-unknown': null,
    'function-name-case': ['lower', { ignoreKeywords: ['/colorPalette/'] }]
  }
};
