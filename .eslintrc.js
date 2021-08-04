// javascript
const eslint = require('@fatesigner/eslint-config');

// typescript
const tslint = require('@fatesigner/eslint-config/ts');

// vue
const vuelint = require('@fatesigner/eslint-config/vue');

module.exports = {
  root: true,
  overrides: [eslint, tslint, vuelint]
};
