const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/regression-tests'],
  // Jest 22 requires setupTestFrameworkScriptFile instead of setupFilesAfterEnv
  setupTestFrameworkScriptFile: require('path').resolve(
    __dirname,
    'setupTests.js'
  ),
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
};
