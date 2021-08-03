// javascript
const eslint = require('@fatesigner/eslint-config');

// typescript
const tslint = require('@fatesigner/eslint-config/ts');

module.exports = {
  root: true,
  overrides: [eslint, tslint]
};
