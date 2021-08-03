module.exports = {
  'build/**/*.{js,jsx}': ['eslint --fix --cache --quiet', 'prettier --write --ignore-path .eslintignore'],
  'src/**/*.{js,jsx}': ['eslint --fix --cache --quiet', 'prettier --write --ignore-path .eslintignore'],
  'src/**/*.{ts,tsx}': ['eslint --fix --cache --quiet', 'prettier --write --ignore-path .eslintignore --parser typescript']
};
