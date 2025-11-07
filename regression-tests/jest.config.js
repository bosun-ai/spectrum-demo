const path = require('path');
module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  testRegex: 'regression-tests/.*\\.test\\.js$',
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: path.resolve(__dirname, './setupTests.js'),
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
  },
};
