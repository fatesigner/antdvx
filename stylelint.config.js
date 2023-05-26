/**
 * stylelint config
 * npm i stylelint stylelint-config-css-modules stylelint-config-recess-order stylelint-config-standard-scss stylelint-config-standard stylelint-order -D
 */

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recess-order',
    'stylelint-config-css-modules'
  ],
  plugins: ['stylelint-order'],
  rules: {
    indentation: 2,
    'at-rule-empty-line-before': null,
    'at-rule-name-space-after': null,
    'at-rule-no-unknown': null,
    /* 'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'responsive',
          'variants',
          'screen',
          'extend',
          'at-root',
          'debug',
          'warn',
          'error',
          'if',
          'else',
          'for',
          'each',
          'while',
          'mixin',
          'include',
          'content',
          'return',
          'function',
          'tailwind',
          'apply',
          'responsive',
          'variants',
          'screen'
        ]
      }
    ], */
    'block-no-empty': null,
    'color-function-notation': null,
    'comment-empty-line-before': null,
    'declaration-block-trailing-semicolon': null,
    'declaration-colon-newline-after': null,
    'declaration-colon-space-after': null,
    'function-name-case': ['lower', { ignoreFunctions: ['/colorPalette/'] }],
    'function-no-unknown': null,
    'function-parentheses-newline-inside': null,
    'import-notation': null,
    'rule-empty-line-before': null,
    'selector-combinator-space-after': null,
    'selector-combinator-space-before': null,
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep', 'v-deep'] }],
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep', 'global'] }],
    'selector-type-no-unknown': [true, { ignoreTypes: [/^uni-/] }],
    'string-quotes': 'single',
    'max-line-length': null,
    'no-missing-end-of-source-newline': null,
    'no-descending-specificity': null,
    'number-max-precision': null,
    // 'property-no-unknown': [true, { ignoreProperties: [] }],
    'property-no-unknown': null,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx', 'upx'] }],
    'value-list-comma-newline-after': null,
    // SCSS
    'scss/at-rule-no-unknown': null,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/double-slash-comment-whitespace-inside': null
  }
};
