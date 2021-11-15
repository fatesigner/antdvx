module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html', 'lcov', 'text', 'text-summary', 'clover'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: 'tsconfig.test.json',
      babelConfig: 'babel.test.config.js'
    }
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    // '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: ['(/tests/.*|(\\.|/)(test))\\.jsx?$', '(/tests/.*|(\\.|/)(test))\\.tsx?$'],
  // testMatch: ['./test/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!)']
};
