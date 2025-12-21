const path = require('path');

module.exports = {
  rootDir: '.', // paths in this config are relative to the regression-tests directory
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
  },
  transform: {
    '^.+\\.js$': path.resolve(__dirname, '../node_modules/babel-jest'),
  },
};
