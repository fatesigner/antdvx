const czConfig = require('./.cz-config');

const types = czConfig.types.map((x) => x.value);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'never'],
    'type-enum': [2, 'always', types]
  }
};
