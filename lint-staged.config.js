module.exports = {
  'build/**/*.{js,jsx}': ['npx eslint --fix --cache --quiet', 'prettier --write --ignore-path .eslintignore'],
  'src/**/*.{js,jsx}': ['npx eslint --fix --cache --quiet', 'prettier --write --ignore-path .eslintignore'],
  'src/**/*.{ts,tsx}': [
    'npx eslint --fix --cache --quiet',
    'npx prettier --write --ignore-path .eslintignore --parser typescript'
  ],
  'src/**/*.{vue}': ['npx eslint --fix --cache --quiet'],
  'src/**/*.{css,scss}': ['npx stylelint --fix --quiet']
};
