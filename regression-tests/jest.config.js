const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  testMatch: ['**/regression-tests/**/*.test.js'],
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/regression-tests/setupTests.js',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
  },
};
