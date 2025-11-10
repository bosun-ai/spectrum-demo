const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: path.resolve(__dirname, './setupTests.js'),
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testRegex: 'regression-tests/.*\\.test\\.js$',
  transform: {
    '^.+\\.(js|jsx)$': path.resolve(__dirname, '../node_modules/babel-jest'),
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
  },
  testURL: 'http://localhost/',
};
